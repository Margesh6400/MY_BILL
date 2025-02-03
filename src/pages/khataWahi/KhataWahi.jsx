import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/header/Navbar";
import { Trash2, Edit, X, Menu, ChevronDown, Plus, Search } from "lucide-react";
import "./KhataWahi.css";

const EditReceiptRow = ({ receipt, onSave, onCancel }) => {
  const [editedReceipt, setEditedReceipt] = useState({
    ...receipt,
    date: receipt.date.split("T")[0],
    sizes: receipt.sizes.map((size) => ({
      ...size,
      pisces: size.pisces || 0,
      total: size.total || 0,
    })),
  });

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...editedReceipt.sizes];
    const numValue = parseInt(value) || 0;
    newSizes[index] = { ...newSizes[index], [field]: numValue };

    if (field === "pisces") {
      newSizes[index].total = newSizes[index].pisces || 0;
    }

    const newTotal = newSizes.reduce((sum, size) => sum + (size.total || 0), 0);

    setEditedReceipt((prev) => ({
      ...prev,
      sizes: newSizes,
      total: newTotal,
    }));
  };

  // Mobile view layout
  const MobileView = () => (
    <td colSpan="100%" className="p-4 bg-blue-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            Receipt: {editedReceipt.receiptNumber}
          </span>
          <button
            onClick={onCancel}
            className="p-2 transition-colors rounded-full hover:bg-blue-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            value={editedReceipt.date}
            onChange={(e) =>
              setEditedReceipt((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {editedReceipt.sizes.map((size, index) => (
            <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
              <label className="block mb-2 text-sm font-medium">
                Size {size.size}
              </label>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="numeric"
                min="0"
                value={size.pisces}
                onChange={(e) =>
                  handleSizeChange(index, "pisces", e.target.value)
                }
                className="w-full px-3 py-2 text-sm bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Pieces"
              />
              <div className="mt-1 text-sm text-gray-500">
                Total: {size.total}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Notes</label>
          <input
            type="text"
            value={editedReceipt.notes || ""}
            onChange={(e) =>
              setEditedReceipt((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Add notes"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={() => onSave(editedReceipt)}
            className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </td>
  );

  // Desktop view layout
  const DesktopView = () => (
    <>
      <td className="p-2 align-middle md:p-4">{editedReceipt.receiptNumber}</td>
      <td className="p-2 align-middle md:p-4">
        <input
          type="date"
          value={editedReceipt.date}
          onChange={(e) =>
            setEditedReceipt((prev) => ({ ...prev, date: e.target.value }))
          }
          className="w-full px-2 py-1 text-sm bg-white border rounded-md md:w-auto md:px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </td>
      <td className="p-2 align-middle md:p-4">{editedReceipt.total}</td>
      {editedReceipt.sizes.map((size, index) => (
        <td
          key={index}
          className="hidden p-2 align-middle md:table-cell md:p-4"
        >
          <div className="flex flex-col gap-2">
            <input
              type="number"
              min="0"
              value={size.pisces}
              onChange={(e) =>
                handleSizeChange(index, "pisces", e.target.value)
              }
              className="w-full px-2 py-1 text-sm bg-white border rounded-md md:px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Pieces"
            />
            <div className="text-sm text-gray-500">Total: {size.total}</div>
          </div>
        </td>
      ))}
      <td className="p-2 align-middle md:p-4">
        <input
          type="text"
          value={editedReceipt.notes || ""}
          onChange={(e) =>
            setEditedReceipt((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full px-2 py-1 text-sm bg-white border rounded-md md:px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Notes"
        />
      </td>
      <td className="p-2 align-middle md:p-4">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onSave(editedReceipt)}
            className="px-2 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md md:px-4 md:py-2 hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 text-sm transition-colors bg-gray-100 rounded-md md:px-4 md:py-2 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </td>
    </>
  );

  return (
    <>
      <tr className="md:hidden">
        <MobileView />
      </tr>
      <tr className="hidden md:table-row">
        <DesktopView />
      </tr>
    </>
  );
};

const ClientData = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteReceiptConfirm, setShowDeleteReceiptConfirm] =
    useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [expandedMobileView, setExpandedMobileView] = useState(null);

  const API_BASE_URL = "https://nilkanth-back.onrender.com";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      const sortedUsers = response.data.sort((a, b) =>
        a.name.localeCompare(b.name, "gu-IN")
      );
      setUserData(sortedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please check your connection.");
      setIsLoading(false);
    }
  };

  const calculateCurrentStockBySizes = (returnItems) => {
    const sizeStock = {};
    returnItems.forEach((item) => {
      const secondChar = item.receiptNumber?.[1];
      item.sizes?.forEach((size) => {
        if (!sizeStock[size.size]) {
          sizeStock[size.size] = 0;
        }
        const itemTotal = size.total || 0;
        if (secondChar === "J") {
          sizeStock[size.size] -= itemTotal;
        } else if (secondChar === "U") {
          sizeStock[size.size] += itemTotal;
        }
      });
    });
    return sizeStock;
  };

  const handleDeleteReceipt = async (receiptNumber) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/return-items/${receiptNumber}`);
      setReturnItems((prevItems) =>
        prevItems.filter((item) => item.receiptNumber !== receiptNumber)
      );
      setShowDeleteReceiptConfirm(false);
      setReceiptToDelete(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting receipt:", error);
      setError("Failed to delete receipt. Please try again.");
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/users/${userData.userId}`,
        userData
      );
      setUserData((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userData.userId ? response.data : user
        )
      );
      if (selectedUser?.userId === userData.userId) {
        setSelectedUser(response.data);
      }
      setEditingUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${user.userId}`);
      setUserData((prevUsers) =>
        prevUsers.filter((u) => u.userId !== user.userId)
      );
      if (selectedUser?.userId === user.userId) {
        setSelectedUser(null);
        setReturnItems([]);
      }
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
      setIsLoading(false);
    }
  };

  const handleUpdateReceipt = async (receiptData) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/return-items/${receiptData.receiptNumber}`,
        receiptData
      );
      setReturnItems((prevItems) =>
        prevItems.map((item) =>
          item.receiptNumber === receiptData.receiptNumber
            ? response.data
            : item
        )
      );
      setEditingReceipt(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating receipt:", error);
      setError("Failed to update receipt. Please try again.");
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getRowBackgroundColor = (receiptNumber) => {
    if (!receiptNumber || receiptNumber.length < 2) return "";
    const secondChar = receiptNumber[1];
    switch (secondChar) {
      case "J":
        return "bg-blue-50 hover:bg-blue-100";
      case "U":
        return "bg-blue-50 hover:bg-blue-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  const handleRowClick = async (user) => {
    if (selectedUser && selectedUser.userId === user.userId) {
      setSelectedUser(null);
      setReturnItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/return-items?userId=${user.userId}`
      );
      const sortedItems = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSelectedUser(user);
      setReturnItems(sortedItems);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user return items:", error);
      setError("Failed to fetch return items. Please try again.");
      setIsLoading(false);
    }
  };

  const getRowBackgroundColor1 = (receiptNumber) => {
    const type = receiptNumber[1];
    if (type === "J") return "bg-green-50";
    if (type === "U") return "bg-red-50";
    return "";
  };

  return (
    <Navbar>
      <div className="billing-system">
        <div className="container">
          <div className="flex items-center justify-between p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-400">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              ખાતાવહી
            </h2>
          </div>

          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-base text-center">Loading...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Error!</span>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <br />
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="hidden md:table-header-group">
                  <tr className="text-white bg-blue-500">
                    {["ID", "નામ", "સાઇડ", "મોબાઇલ", "Actions"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className="h-12 px-4 font-medium text-left text-white align-middle"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user) => (
                    <React.Fragment key={user.userId}>
                      <tr
                        onClick={() => handleRowClick(user)}
                        className="block transition-colors cursor-pointer md:table-row hover:bg-blue-50"
                      >
                        <td className="flex justify-between ">
                          <div className="mx-5 text-sm md:text-base">
                            {user.userId}
                          </div>
                          <div className="flex flex-col mr-40">
                            <span className="text-sm font-medium text-blue-600 sm:hidden">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden">
                              {user.site || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden">
                              {user.phone || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 md:hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUser(user);
                              }}
                              className="p-1.5 text-blue-600 rounded-full hover:bg-blue-100"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 text-red-600 rounded-full hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          {user.name}
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          {user.site || "N/A"}
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          {user.phone || "N/A"}
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-blue-600 transition-colors rounded-full hover:bg-blue-100"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 text-red-600 transition-colors rounded-full hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {selectedUser?.userId === user.userId && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <div className="m-2 bg-white border-blue-200 rounded-lg shadow-lg">
                              <div className="p-4">
                                <div className="flex flex-col gap-2 mb-4">
                                  <h3 className="text-xl font-semibold text-blue-700">
                                    {selectedUser.name}
                                  </h3>
                                  <span className="text-sm text-gray-600">
                                    Mobile: {selectedUser.phone || "N/A"}
                                  </span>
                                </div>

                                <div className="mb-4 overflow-x-auto">
                                  <table className="w-full border border-collapse border-blue-200">
                                    <thead>
                                      <tr className="bg-blue-50">
                                        <th
                                          className="p-2 text-center border border-blue-200"
                                          colSpan={
                                            returnItems[0]?.sizes?.length + 4
                                          }
                                        >
                                          Size-wise Stock Status
                                        </th>
                                      </tr>
                                      <tr className="bg-blue-50">
                                        {[
                                          "Type",
                                          "Udhar",
                                          "Jama",
                                          "Balance",
                                          ...returnItems[0]?.sizes?.map(
                                            (size) => size.size
                                          ),
                                        ].map((header, index) => (
                                          <th
                                            key={index}
                                            className="p-2 border border-blue-200"
                                          >
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        const stockBySize =
                                          calculateCurrentStockBySizes(
                                            returnItems
                                          );
                                        const udharTotal = returnItems.reduce(
                                          (sum, item) =>
                                            item.receiptNumber[1] === "U"
                                              ? sum + (item.total || 0)
                                              : sum,
                                          0
                                        );
                                        const jamaTotal = returnItems.reduce(
                                          (sum, item) =>
                                            item.receiptNumber[1] === "J"
                                              ? sum + (item.total || 0)
                                              : sum,
                                          0
                                        );
                                        const balance = udharTotal - jamaTotal;
                                        return (
                                          <tr>
                                            <td className="p-2 font-medium border border-blue-200">
                                              Current Stock
                                            </td>
                                            <td className="p-2 font-medium text-center text-red-600 border border-blue-200">
                                              {udharTotal}
                                            </td>
                                            <td className="p-2 font-medium text-center text-green-600 border border-blue-200">
                                              {jamaTotal}
                                            </td>
                                            <td
                                              className={`border border-blue-200 p-2 text-center font-medium ${
                                                balance > 0
                                                  ? "text-red-600"
                                                  : balance < 0
                                                  ? "text-green-600"
                                                  : ""
                                              }`}
                                            >
                                              {balance}
                                            </td>
                                            {returnItems[0]?.sizes?.map(
                                              (size) => (
                                                <td
                                                  key={size.size}
                                                  className={`border border-blue-200 p-2 text-center ${
                                                    stockBySize[size.size] > 0
                                                      ? "text-blue-600"
                                                      : stockBySize[size.size] <
                                                        0
                                                      ? "text-blue-600"
                                                      : ""
                                                  }`}
                                                >
                                                  {stockBySize[size.size] || 0}
                                                </td>
                                              )
                                            )}
                                          </tr>
                                        );
                                      })()}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="w-full overflow-x-auto">
                                  <table className="w-full min-w-full table-auto">
                                    <thead>
                                      <tr className="bg-blue-50">
                                        {[
                                          "Receipt",
                                          "Date",
                                          "Total",
                                          ...returnItems[0]?.sizes?.map(
                                            (size) => size.size
                                          ),
                                          "Notes",
                                          "Actions",
                                        ].map((header, index) => (
                                          <th
                                            key={index}
                                            className="h-10 px-2 text-sm font-medium text-left align-middle md:px-4"
                                          >
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {returnItems.map((item) => (
                                        <tr
                                          key={item.receiptNumber}
                                          className={`border-b ${getRowBackgroundColor1(
                                            item.receiptNumber
                                          )}`}
                                        >
                                          {editingReceipt?.receiptNumber ===
                                          item.receiptNumber ? (
                                            <EditReceiptRow
                                              receipt={item}
                                              onSave={handleUpdateReceipt}
                                              onCancel={() =>
                                                setEditingReceipt(null)
                                              }
                                            />
                                          ) : (
                                            <>
                                              <td className="p-2 text-sm font-medium text-blue-600 md:p-4">
                                                {item.receiptNumber}
                                              </td>
                                              <td className="p-2 text-sm md:p-4">
                                                {formatDate(item.date)}
                                              </td>
                                              <td className="p-2 text-sm md:p-4">
                                                {item.total}
                                              </td>
                                              {item.sizes?.map((size) => (
                                                <td
                                                  key={size.size}
                                                  className="p-2 text-sm text-center md:p-4"
                                                >
                                                  {size.total || "0"}
                                                </td>
                                              ))}
                                              <td className="p-2 text-sm md:p-4">
                                                {item.notes || "N/A"}
                                              </td>
                                              <td className="p-2 md:p-4">
                                                <div className="flex items-center space-x-1 md:space-x-2">
                                                  <button
                                                    onClick={() =>
                                                      setEditingReceipt(item)
                                                    }
                                                    className="p-1 text-blue-600 transition-colors rounded-full md:p-2 hover:bg-blue-100"
                                                  >
                                                    <Edit className="w-4 h-4" />
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      setReceiptToDelete(item);
                                                      setShowDeleteReceiptConfirm(
                                                        true
                                                      );
                                                    }}
                                                    className="p-1 text-red-600 transition-colors rounded-full md:p-2 hover:bg-red-100"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete User Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-blue-700">
                  Confirm Delete
                </h3>
                <p className="mb-2">
                  Are you sure you want to delete user {userToDelete?.name}?
                </p>
                <p className="mb-4 text-sm text-red-600">
                  This will also delete all associated receipts.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 text-sm transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(userToDelete)}
                    className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Receipt Confirmation Modal */}
          {showDeleteReceiptConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-blue-700">
                  Confirm Delete
                </h3>
                <p className="mb-2">
                  Are you sure you want to delete receipt #
                  {receiptToDelete?.receiptNumber}?
                </p>
                <p className="mb-4 text-sm text-red-600">
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteReceiptConfirm(false);
                      setReceiptToDelete(null);
                    }}
                    className="px-4 py-2 text-sm transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteReceipt(receiptToDelete.receiptNumber)
                    }
                    className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-blue-700">
                    Edit User Details
                  </h3>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="text-gray-500 transition-colors hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={editingUser.userId}
                      disabled
                      className="w-full p-2 text-sm border rounded-md bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full p-2 text-sm border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Site
                    </label>
                    <input
                      type="text"
                      value={editingUser.site || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          site: e.target.value,
                        }))
                      }
                      className="w-full p-2 text-sm border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingUser.phone || ""}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full p-2 text-sm border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-sm transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateUser(editingUser)}
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default ClientData;
