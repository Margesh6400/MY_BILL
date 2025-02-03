import React, { useState, useEffect } from "react";
import Navbar from "../../components/header/Navbar";
import axios from "axios";
import html2canvas from "html2canvas";
import SingleSelectionChecklist from "../../components/singleSelectionCheckList/SingleSelectionCheckListJ";
import rightImage1 from "../../assets/JamaReceiptTemplate.jpg";

const UdharChallan = () => {
  // Generate current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");
  };

  const [userData, setUserData] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    receiptNumber: "RJ-",
    date: getCurrentDate(),
    userId: "",
    name: "",
    site: "",
    phone: "",
    sizes: [
      { size: "2 X 3", pisces: "", mark: "", total: "" },
      { size: "21 X 3", pisces: "", mark: "", total: "" },
      { size: "18 X 3", pisces: "", mark: "", total: "" },
      { size: "15 X 3", pisces: "", mark: "", total: "" },
      { size: "12 X 3", pisces: "", mark: "", total: "" },
      { size: "9 X 3", pisces: "", mark: "", total: "" },
      { size: "પતરા", pisces: "", mark: "", total: "" },
      { size: "2 X 2", pisces: "", mark: "", total: "" },
      { size: "2 ફુટ", pisces: "", mark: "", total: "" },
    ],
    total: "",
    grandTotal: "",
    notes: "",
    selectedMarkOption: "",
  });

  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    site: "",
    phone: "",
  });

  const generateReceiptContent = () => {
    return `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&display=swap');
            body {
              font-family: 'Noto Sans Gujarati', sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              position: relative;
              width: 210mm;
              height: 297mm;
              overflow: hidden;
              box-sizing: border-box;
              padding: 10mm;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .user-details {
              margin-bottom: 20px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th, .items-table td {
              padding: 8px;
              text-align: center;
            }
            .watermark {
              position: absolute;
              top: 30px;
              right: 0px;
              width: 100%;
              height: 95%;
              z-index: -1;
            }
            .watermark img {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="watermark">
              <img src="${rightImage1}" alt="Watermark">
            </div>
            <div>
              <p style="position: absolute; top: 260px; left: 165px; font-weight: bold; font-size: 1rem;">${
                formData.receiptNumber
              }</p>
              <p style="position: absolute; top: 260px; left: 570px; font-weight: bold; font-size: 1rem;">${formatDate(
                formData.date
              )}</p>
            </div>
            <div class="user-details">
              <p style="position: absolute; top: 312px; left: 615px; font-weight: bold; font-size: 1.2rem;">${
                formData.userId
              }</p>
              <p style="position: absolute; top: 312px; left: 145px; font-weight: bold; font-size: 1.2rem;">${
                formData.name
              }</p>
              <p style="position: absolute; top: 342px; left: 145px; font-weight: bold; font-size: 1.2rem;">${
                formData.site
              }</p>
              <p style="position: absolute; top: 400px; left: 145px; font-weight: bold; font-size: 1.2rem;">${
                formData.phone
              }</p>
            </div>
            ${formData.sizes
              .map(
                (size, index) => `
              <p style="position: absolute; top: ${
                490 + index * 40
              }px; left: 240px; font-weight: bold; font-size: 1.2rem; color: black;">${
                  size.total || "&nbsp;"
                }</p>
              <p style="position: absolute; top: ${
                490 + index * 40
              }px; left: 400px; font-weight: bold; font-size: 1.2rem; color: black;">${
                  size.mark || "&nbsp;"
                }</p>
            `
              )
              .join("")}
            <p style="position: absolute; top: 443px; left: 390px; font-weight: bold; font-size: 1.4rem; color: white;">${
              formData.selectedMarkOption
            }</p>
            <p style="position: absolute; top: 845px; left: 240px; font-weight: bold; font-size: 1.2rem;">${
              formData.grandTotal
            }</p>
            <p style="position: absolute; top: 982px; left: 445px; font-weight: bold; font-size: 1.2rem;">${
              formData.grandTotal
            }</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateJPEG = async () => {
    try {
      const container = document.createElement("div");
      container.innerHTML = generateReceiptContent();
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: false,
        windowWidth: 800,
        windowHeight: 200,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const jpegUrl = canvas.toDataURL("image/jpeg", 1.0);
      const jpegLink = document.createElement("a");
      jpegLink.download = `${formData.receiptNumber}_${formatDate(
        formData.date
      )}.jpg`;
      jpegLink.href = jpegUrl;
      jpegLink.click();

      document.body.removeChild(container);
      return true;
    } catch (error) {
      console.error("JPEG Generation Error:", error);
      throw new Error("Error generating JPEG. Please try again.");
    }
  };

  const apiCall = async (method, url, data = null) => {
    try {
      const response = await axios({
        method,
        url: `https://nilkanth-back.onrender.com${url}`,
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [users, items] = await Promise.all([
          apiCall("get", "/users"),
          apiCall("get", "/return-items"),
        ]);
        setUserData(users);
        setReturnItems(items);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "receiptNumber") {
      const prefix = "RJ-";
      const newValue = value.startsWith(prefix)
        ? value
        : prefix + value.replace(prefix, "");

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === "userId") {
      const filteredSuggestions = userData
        .filter(
          (user) =>
            user.userId.toLowerCase().includes(value.toLowerCase()) ||
            user.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((user) => ({
          ...user,
          displayText: `${user.userId} - ${user.name}`,
        }))
        .slice(0, 5);

      setSuggestions(filteredSuggestions);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setNewUser((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddNewUser = async () => {
    if (!newUser.userId || !newUser.name) {
      alert("User ID and Name are required!");
      return;
    }

    try {
      const response = await apiCall("post", "/users", newUser);
      setUserData((prev) => [...prev, response]);
      setShowNewUserModal(false);
      setNewUser({
        userId: "",
        name: "",
        site: "",
        phone: "",
      });
      alert("User Added Successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSuggestionSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      userId: user.userId,
      name: user.name,
      site: user.site || "",
      phone: user.phone || "",
    }));
    setSuggestions([]);
  };

  const handleSizeInputChange = (index, e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    setFormData((prev) => {
      const updatedSizes = [...prev.sizes];
      updatedSizes[index] = {
        ...updatedSizes[index],
        [name]: numericValue,
      };

      const total =
        (parseInt(updatedSizes[index].pisces) || 0) +
        (parseInt(updatedSizes[index].mark) || 0);
      updatedSizes[index].total = total.toString();

      const grandTotal = updatedSizes.reduce(
        (acc, curr) =>
          acc + (parseInt(curr.pisces) || 0) + (parseInt(curr.mark) || 0),
        0
      );

      return {
        ...prev,
        sizes: updatedSizes,
        grandTotal: grandTotal.toString(),
        total: grandTotal.toString(),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.name) {
      alert("User ID and Name are required!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submissionData = {
        receiptNumber: formData.receiptNumber,
        date: new Date(formData.date).toISOString(),
        userId: formData.userId,
        name: formData.name,
        site: formData.site || "",
        phone: formData.phone || "",
        sizes: formData.sizes.map((size) => ({
          size: size.size,
          pisces: parseInt(size.pisces) || 0,
          mark: parseInt(size.mark) || 0,
          total: parseInt(size.total) || 0,
        })),
        total: parseInt(formData.total) || 0,
        grandTotal: parseInt(formData.grandTotal) || 0,
        notes: formData.notes || "",
        selectedMarkOption: formData.selectedMarkOption,
        metadata: {
          createdAt: new Date().toISOString(),
        },
      };

      const response = await apiCall("post", "/return-items", submissionData);
      await generateJPEG();

      alert(
        "Return Item Submitted Successfully! JPEG file has been generated."
      );

      setFormData((prev) => ({
        ...prev,
        receiptNumber: `RJ-`,
        userId: "",
        name: "",
        site: "",
        phone: "",
        sizes: prev.sizes.map((size) => ({
          ...size,
          pisces: "",
          mark: "",
          total: "",
        })),
        total: "",
        grandTotal: "",
        notes: "",
        selectedMarkOption: "",
      }));

      setReturnItems((prev) => [response, ...prev]);
    } catch (error) {
      setError(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Navbar>
      <div className="min-h-screen p-2 pt-16 bg-gradient-to-br from-green-50 to-green-100">
        {error && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-3 rounded shadow-lg mx-auto max-w-[800px] text-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-[800px] mx-auto transform transition-all hover:shadow-green-200"
        >
          {/* Header Section - Reduced padding */}
          <div className="p-3 bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold tracking-wide text-white">
                જમા ચલણ
              </h1>
            </div>
          </div>

          {/* Basic Details Section - Reduced padding and spacing */}
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  ચલણ નંબર:
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200 text-sm"
                  placeholder="RJ-"
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  તારીખ:
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200 text-sm"
                />
              </div>
            </div>
            {/* User Details Section - Compact spacing */}
            <div className="space-y-3">
              <div className="relative">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  ID:
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200 text-sm"
                  placeholder="Enter User ID"
                  required
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-green-100 rounded-lg shadow-lg">
                    {suggestions.map((user, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionSelect(user)}
                        className="px-3 py-1.5 hover:bg-green-50 cursor-pointer transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-sm"
                      >
                        {user.displayText}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {["name", "site", "phone"].map((field) => (
                <div key={field} className="relative">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    {field === "name"
                      ? "નામ:"
                      : field === "site"
                      ? "સાઇડ:"
                      : "મોબાઇલ:"}
                  </label>
                  <input
                    type={field === "phone" ? "tel" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200 text-sm"
                    placeholder={`Enter ${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }`}
                    required={field === "name"}
                    inputMode={field === "phone" ? "numeric" : "text"}
                    pattern={field === "phone" ? "[0-9]*" : undefined}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Table Section - Compact design */}
          <div className="p-3 bg-green-50">
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="text-white bg-gradient-to-r from-green-600 to-green-700">
                    <th className="px-2 py-2 text-sm text-left text-white">
                      સાઈઝ
                    </th>
                    <th className="px-2 py-2 text-sm text-center text-white">
                      કુલ
                    </th>
                    <th className="px-2 py-2 text-sm text-center text-white">
                      પ્લેટનંગ
                    </th>
                    <th className="px-2 py-2 text-center">
                      <SingleSelectionChecklist
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.sizes.map((sizeItem, index) => (
                    <tr
                      key={index}
                      className="transition-colors duration-200 border-b border-green-100 hover:bg-green-50"
                    >
                      <td className="px-2 py-2 text-sm text-gray-800">
                        {sizeItem.size}
                      </td>
                      <td className="px-2 py-2 text-sm font-semibold text-center text-green-600">
                        {(parseInt(sizeItem.pisces) || 0) +
                          (parseInt(sizeItem.mark) || 0)}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          name="pisces"
                          value={sizeItem.pisces}
                          onChange={(e) => handleSizeInputChange(index, e)}
                          className="w-full px-2 py-1 text-sm text-center transition-all duration-200 border border-green-200 rounded focus:border-green-500 focus:ring-1 focus:ring-green-200"
                          placeholder="Qty"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          name="mark"
                          value={sizeItem.mark}
                          onChange={(e) => handleSizeInputChange(index, e)}
                          className="w-full px-2 py-1 text-sm text-center transition-all duration-200 border border-green-200 rounded focus:border-green-500 focus:ring-1 focus:ring-green-200"
                          placeholder="Marks"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-green-50">
                    <td className="px-2 py-2 text-sm font-bold text-green-700">
                      કુલ નંગ
                    </td>
                    <td className="px-2 py-2 text-sm font-bold text-center text-green-700">
                      {formData.grandTotal}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section - Reduced padding */}
          <div className="p-3">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional Notes"
              className="w-full px-3 py-2 text-sm transition-all duration-200 border border-green-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200"
            />
          </div>

          {/* Submit Button - Compact design */}
          <div className="p-3 border-t border-green-100 bg-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-300 disabled:to-green-400 hover:shadow-green-200"
            >
              {isSubmitting ? "જમાing..." : "જમા નંગ"}
            </button>
          </div>
        </form>
      </div>
    </Navbar>
  );
};

export default UdharChallan;
