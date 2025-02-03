import React, { useState, useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import axios from "axios";
import Navbar from "../../components/header/Navbar";
import html2pdf from 'html2pdf.js';
import './bills.css';
import rightImage1 from "../../assets/BillTemplate.jpg";

const BillingSystem = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRates, setUserRates] = useState({});
  const [serviceChargeRates, setServiceChargeRates] = useState({});
  const [userReturnItems, setUserReturnItems] = useState({});
  const [totalInventory, setTotalInventory] = useState({});
  const [userPayments, setUserPayments] = useState({});
  const [lastDates, setLastDates] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [bills, setBills] = useState([]);
  const [showBillHistory, setShowBillHistory] = useState(false);
  const [userBillTotals, setUserBillTotals] = useState({});
  const [netAmountDue, setNetAmountDue] = useState({});

  const API_BASE_URL = "https://nilkanth-back.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      const sortedUsers = response.data.sort((a, b) => 
        a.name.localeCompare(b.name, 'gu-IN')
      );
      setUserData(sortedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please check your connection.");
      setIsLoading(false);
    }
  };


  const calculateNetAmountDue = (userId, items) => {
    const endDate = lastDates[userId] ? new Date(lastDates[userId]) : new Date();
    const periods = calculateDetailedBillingPeriods(items, userId, endDate);
    const totalCharge = periods.reduce((sum, period) => sum + period.charge, 0);
    const previousPayments = userBillTotals[userId]?.completedPayment || 0;
    return totalCharge - previousPayments;
  };

  const generatePDF = (userId) => {
    const user = userData.find(u => u.userId === userId);
    const items = userReturnItems[userId] || [];
    const endDate = lastDates[userId] ? new Date(lastDates[userId]) : new Date();
    const periods = calculateDetailedBillingPeriods(items, userId, endDate);
    const totalCharge = periods.reduce((sum, period) => sum + period.charge, 0);
    const previousPayments = userBillTotals[userId]?.completedPayment || 0;
    const remainingToPay = totalCharge - previousPayments;

    const createHtmlContent = () => {
      function addOneDay(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() - 1); // Add one day
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }    
        const tableRows = periods.map(period => {
            if (period.isServiceCharge) {
                return `
                        <p style="position: absolute; top: 810px; left: 360px; font-weight: semi-bold; font-size: 1.3rem;">સર્વિસ ચાર્જ</p>
                        <p style="position: absolute; top: 810px; left: 580px; font-weight: semi-bold; font-size: 1rem;" >${period.totalUdhar} × ${period.serviceChargeRate}</p>
                        <p style="position: absolute; top: 810px; left: 660px; font-weight: semi-bold; font-size: 1rem;" >${period.charge.toFixed(2)}</p>
                `;
            }
            return `
                <tr>
                    <td style="position: absolute; padding-top: 380px; left: 60px; font-weight: semi-bold; font-size: 0.9rem;" >${formatDate(period.displayDate)}</td>
                    <td style="position: absolute; padding-top: 340px; left: 220px; font-weight: semi-bold; font-size: 0.9rem;" >${formatDate(addOneDay(period.displayDate))}</td>
                    <td style="position: absolute; padding-top: 380px; left: 370px; font-weight: semi-bold; font-size: 0.9rem;">${period.stockChange}</td>
                    <td style="position: absolute; padding-top: 380px; left: 480px; font-weight: semi-bold; font-size: 0.9rem;">${period.runningStock}</td>
                    <td style="position: absolute; padding-top: 380px; left: 580px; font-weight: semi-bold; font-size: 0.9rem;">${period.days}</td>
                    <td style="position: absolute; padding-top: 380px; left: 670px; font-weight: semi-bold; font-size: 0.9rem;">₹${period.days*period.dailyRate*period.runningStock }</td>
                    <td style="opacity: 0;">${period.dailyRate}</td>
                </tr>
            `;
        }).join('');

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
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
        }
        .watermark {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .watermark img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        table {
            top: 100mm;
            left: 10mm;
            width: 185mm;
            font-size: 10px;
        }
  
    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="watermark">
                            <img src="${rightImage1}" alt="Watermark">
                        </div>
                        <div>
                            <p style="position: absolute; top: 186.5px; left: 635px; font-weight: semi-bold; font-size: 1.3rem;">${user.userId}</p>
                        </div>
                        <div class="header">
                            <p style="position: absolute; top: 240px; left: 130px; font-weight: semi-bold; font-size: 1.3rem;">${user.name}</p>
                            <p style="position: absolute; top: 240px; left: 620px; font-weight: semi-bold; font-size: 1.3rem;">${user.userId}</p>
                            <p style="position: absolute; top: 280px; left: 635px; font-weight: semi-bold; font-size: 1rem;">${formatDate(new Date().toISOString())}</p>
                            <p style="position: absolute; top: 274px; left: 135px; font-weight: semi-bold; font-size: 1.3rem;">${user.site}</p>
                        </div>
                        <table>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                        <div class="totals">
                            <p style="position: absolute; top: 840px; left: 495px; font-weight: semi-bold; font-size: 1.3rem;" >કુલ:</p>
                            <p style="position: absolute; top: 845px; left: 650px; font-weight: semi-bold; font-size: 1rem;" >₹${totalCharge.toFixed(2)}</p>
                            <p style="position: absolute; top: 885px; left: 350px; font-weight: semi-bold; font-size: 0.9rem;" >અગાઉની ચુકવણી:</p>
                            <p style="position: absolute; top: 885px; left: 650px; font-weight: semi-bold; font-size: 1rem;" >₹${previousPayments.toFixed(2)}</p>
                            <p style="position: absolute; top: 920px; left: 360px; font-weight: semi-bold; font-size: 1rem;" >બાકી રકમ:</p>
                            <p style="position: absolute; top: 920px; left: 650px; font-weight: semi-bold; font-size: 1rem;" >₹${remainingToPay.toFixed(2)}</p>
                            <p style="position: absolute; top: 960px; left: 360px; font-weight: semi-bold; font-size: 1rem;" >ચૂકાવનુ:</p>
                            <p style="position: absolute; top: 960px; left: 650px; font-weight: semi-bold; font-size: 1rem;" >₹${remainingToPay.toFixed(2)}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    };

    const element = document.createElement('div');
    element.innerHTML = createHtmlContent();
    document.body.appendChild(element);

    const opt = {
        margin: [0, 0, 0, 0],
        filename: `bill_${user.name}_${formatDate(new Date().toISOString())}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2.5, useCORS: true }, // Lowered scale to reduce size
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save()
        .then(() => document.body.removeChild(element));
};


    const fetchAllUserBillTotals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bills`);
      const bills = response.data;
      
      const userTotals = bills.reduce((acc, bill) => {
        const userId = bill.userId;
        if (!acc[userId]) {
          acc[userId] = {
            completedPayment: 0,
            duePayment: 0
          };
        }
        acc[userId].completedPayment += bill.completedPayment;
        acc[userId].duePayment += bill.duePayment;
        return acc;
      }, {});

      setUserBillTotals(userTotals);
    } catch (error) {
      console.error("Error fetching bill totals:", error);
    }
  };

  const fetchBills = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bills?userId=${userId}`);
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const submitPayment = async (userId) => {
    try {
      const endDate = lastDates[userId] ? new Date(lastDates[userId]) : new Date();
      const totalCharge = calculateTotalCharge(userId);
      const paymentAmount = paymentAmounts[userId]?.paid || 0;
      
      const billData = {
        userId,
        userName: selectedUser.name,
        totalAmount: totalCharge,
        completedPayment: paymentAmount,
        duePayment: totalCharge - paymentAmount,
        payments: [{
          amount: paymentAmount,
          paymentMethod: paymentMethods[userId],
          paymentDate: new Date().toISOString()
        }],
        startDate: returnItems[0]?.date,
        endDate: endDate,
      };

      const response = await axios.post(`${API_BASE_URL}/bills`, billData);
      
      setUserPayments(prev => ({
        ...prev,
        [userId]: {
          completed: paymentAmount,
          due: totalCharge - paymentAmount
        }
      }));

      setPaymentAmounts(prev => ({ ...prev, [userId]: { paid: 0, remaining: 0 } }));
      setPaymentMethods(prev => ({ ...prev, [userId]: null }));
      
      await fetchBills(userId);
      await fetchAllUserBillTotals();
      
      alert(`Bill ${response.data.billNumber} created successfully`);
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Error creating bill. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, inventoryResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/inventory`),
      ]);

      await fetchAllUserBillTotals();

      const sortedUsers = usersResponse.data.sort((a, b) =>
        a.name.localeCompare(b.name, "gu-IN")
      );

      const initialRates = {};
      const initialServiceCharges = {};
      const initialPayments = {};
      sortedUsers.forEach((user) => {
        initialRates[user.userId] = 1;
        initialServiceCharges[user.userId] = 5;
        initialPayments[user.userId] = {
          completed: 0,
          due: 0
        };
      });

      setUserRates(initialRates);
      setServiceChargeRates(initialServiceCharges);
      setUserPayments(initialPayments);

      const returnItemsPromises = sortedUsers.map((user) =>
        axios.get(`${API_BASE_URL}/return-items?userId=${user.userId}`)
      );

      const returnItemsResponses = await Promise.all(returnItemsPromises);

      const returnItemsMap = {};
      const newNetAmountDue = {};

      returnItemsResponses.forEach((response, index) => {
        const userId = sortedUsers[index].userId;
        const items = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        returnItemsMap[userId] = items;
        newNetAmountDue[userId] = calculateNetAmountDue(userId, items);
      });

      const processedUsers = sortedUsers.map((user) => {
        const items = returnItemsMap[user.userId] || [];
        const { totalJ, totalU } = calculateTotals(items);
        return {
          ...user,
          jamaTotal: totalJ,
          udharTotal: totalU,
          currentBalance: totalU - totalJ,
        };
      });

      setUserData(processedUsers);
      setUserReturnItems(returnItemsMap);
      setTotalInventory(inventoryResponse.data);
      setNetAmountDue(newNetAmountDue);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please check your connection.");
      setIsLoading(false);
    }
  };

  const calculateTotals = (returnItems) => {
    const totalJ = returnItems
      .filter((item) => item.receiptNumber?.[1] === "J")
      .reduce(
        (sum, item) =>
          sum + (item.sizes?.reduce((s, size) => s + (size.total || 0), 0) || 0),
        0
      );

    const totalU = returnItems
      .filter((item) => item.receiptNumber?.[1] === "U")
      .reduce(
        (sum, item) =>
          sum + (item.sizes?.reduce((s, size) => s + (size.total || 0), 0) || 0),
        0
      );

    return { totalJ, totalU };
  };

  const handleUserSelect = (user) => {
    if (selectedUser?.userId === user.userId) {
      setSelectedUser(null);
      setReturnItems([]);
      return;
    }

    const items = userReturnItems[user.userId] || [];
    setSelectedUser(user);
    setReturnItems(items);
    fetchBills(user.userId);
  };

  const handleRateChange = (userId, newRate) => {
    setUserRates((prevRates) => ({
      ...prevRates,
      [userId]: Math.max(0, Number(newRate)),
    }));
  };

  const handleServiceChargeChange = (userId, newRate) => {
    setServiceChargeRates((prevRates) => ({
      ...prevRates,
      [userId]: Math.max(0, Number(newRate)),
    }));
  };

  const handleLastDateChange = (userId, dateString) => {
    setLastDates(prev => ({
      ...prev,
      [userId]: dateString
    }));
  };

  const handlePaymentMethodChange = (userId, method) => {
    setPaymentMethods(prev => ({
      ...prev,
      [userId]: method
    }));
  };

  const handlePaymentAmountChange = (userId, amount) => {
    const numAmount = parseFloat(amount) || 0;
    const totalCharge = calculateTotalCharge(userId);
    const previousPayments = userBillTotals[userId]?.completedPayment || 0;
    const remainingToPay = totalCharge - previousPayments;
    
    setPaymentAmounts(prev => ({
      ...prev,
      [userId]: {
        paid: numAmount,
        remaining: remainingToPay - numAmount
      }
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - start;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateDetailedBillingPeriods = (items, userId, endDate = new Date()) => {
    if (!items.length) return [];
  
    const periods = [];
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let runningStock = 0;
    let totalUdhar = 0;
    const dailyRate = userRates[userId] || 1;
  
    const adjustedEndDate = lastDates[userId] 
      ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
      : endDate;
  
    for (let i = 0; i < sortedItems.length; i++) {
      const currentItem = sortedItems[i];
      const nextItem = sortedItems[i + 1];
      const isUdhar = currentItem.receiptNumber?.[1] === "U";
      const stockChange =
        currentItem.sizes?.reduce((sum, size) => sum + (size.total || 0), 0) || 0;
  
      if (isUdhar) {
        runningStock += stockChange;
        totalUdhar += stockChange;
      } else {
        runningStock -= stockChange;
      }
  
      let displayDate;
      if (isUdhar) {
        displayDate = currentItem.date;
      } else {
        const nextDay = new Date(currentItem.date);
        nextDay.setDate(nextDay.getDate() + 1);
        displayDate = nextDay.toISOString().split("T")[0];
      }
  
      const nextDisplayDate = nextItem
        ? nextItem.receiptNumber?.[1] === "U"
          ? nextItem.date
          : new Date(new Date(nextItem.date).setDate(new Date(nextItem.date).getDate() + 1))
              .toISOString()
              .split("T")[0]
        : adjustedEndDate.toISOString().split("T")[0];
  
      const days = calculateDaysBetween(displayDate, nextDisplayDate);
  
      periods.push({
        date: currentItem.date,
        displayDate,
        stockChange: isUdhar ? +stockChange : -stockChange,
        runningStock,
        receiptNumber: currentItem.receiptNumber,
        days,
        charge: Math.abs(runningStock) * days * dailyRate,
        dailyRate,
        isUdhar,
      });
    }
  
    if (periods.length > 0) {
      const serviceChargeRate = serviceChargeRates[userId] || 5;
      periods.push({
        isServiceCharge: true,
        charge: totalUdhar * serviceChargeRate,
        totalUdhar,
        serviceChargeRate,
      });
    }
  
    return periods;
  };

  const calculateTotalCharge = (userId) => {
    const items = userReturnItems[userId] || [];
    const endDate = lastDates[userId] ? new Date(lastDates[userId]) : new Date();
    const periods = calculateDetailedBillingPeriods(items, userId, endDate);
    return periods.reduce((sum, period) => sum + period.charge, 0);
  };

  const BillHistory = ({ userId, onClose }) => (
    <div className="bill-history">
      <div className="bill-history-header">
        <h3>Bill History</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="bill-list">
        {bills.map(bill => (
          <div key={bill.billNumber} className="bill-item">
            <div className="bill-header">
              <span className="bill-number">{bill.billNumber}</span>
              <span className={`bill-status status-${bill.status}`}>
                {bill.status.replace('_', ' ')}
              </span>
            </div>
            <div className="bill-details">
              <p>Date: {formatDate(bill.metadata?.createdAt)}</p>
              <p>Total: ₹{bill.totalAmount.toFixed(2)}</p>
              <p>Paid: ₹{bill.completedPayment.toFixed(2)}</p>
              <p>Due: ₹{bill.duePayment.toFixed(2)}</p>
            </div>
            <div className="payment-history">
              <h4>Payment History</h4>
              {bill.payments.map((payment, index) => (
                <div key={index} className="payment-item">
                  <span>{formatDate(payment.paymentDate)}</span>
                  <span>₹{payment.amount.toFixed(2)}</span>
                  <span>{payment.paymentMethod}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBillingDetails = (user) => {
    if (!returnItems.length) return null;

    const endDate = lastDates[user.userId] ? new Date(lastDates[user.userId]) : new Date();
    const periods = calculateDetailedBillingPeriods(returnItems, user.userId, endDate);
    const totalCharge = periods.reduce((sum, period) => sum + period.charge, 0);
    const previousPayments = userBillTotals[user.userId]?.completedPayment || 0;
    const remainingToPay = totalCharge - previousPayments;

    return (
      <tr>
        <td colSpan="8">
          <div className="billing-details">
            <div className="billing-controls">
              <div className="rate-settings">
                <div className="input-group">
                  <label>Daily Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={userRates[user.userId] || 1}
                    onChange={(e) => handleRateChange(user.userId, e.target.value)}
                    className="rate-input"
                  />
                </div>
                <div className="input-group">
                  <label>Service Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={serviceChargeRates[user.userId] || 5}
                    onChange={(e) => handleServiceChargeChange(user.userId, e.target.value)}
                    className="rate-input"
                  />
                </div>
                <div className="input-group">
                  <label>Last Date</label>
                  <input
                    type="date"
                    value={lastDates[user.userId] || ''}
                    onChange={(e) => handleLastDateChange(user.userId, e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
            </div>

            <div className="scrollable-table">
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Change</th>
                    <th>Stock</th>
                    <th>Days</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, index) => (
                    period.isServiceCharge ? (
                      <tr key="service-charge" className="service-charge-row">
                        <td colSpan={4}>Service Charge</td>
                        <td>{`${period.totalUdhar}×${period.serviceChargeRate}`}</td>
                        <td>₹{period.charge.toFixed(2)}</td>
                      </tr>
                    ) : (
                      <tr key={index} className={period.isUdhar ? "udhar-row" : "jama-row"}>
                        <td>{formatDate(period.displayDate)}</td>
                        <td className={period.isUdhar ? "text-red" : "text-green"}>
                          {period.stockChange}
                        </td>
                        <td>{period.runningStock}</td>
                        <td>
                          <LuCalendarDays className="calendar-icon" />
                          {period.days}
                        </td>
                        <td>{period.dailyRate}</td>
                        <td>₹{period.charge.toFixed(2)}</td>
                      </tr>
                    )
                  ))}
                  <tr className="total-row">
                    <td colSpan={5}>Total Amount:</td>
                    <td>₹{totalCharge.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan={5}>Previous Payments:</td>
                    <td>₹{previousPayments.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row net-total">
                    <td colSpan={5}>Net Due:</td>
                    <td>₹{remainingToPay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="payment-section">
              <div className="payment-methods">
                <label className="radio-label">
                  <input
                    type="radio"
                    name={`paymentMethod-${user.userId}`}
                    value="cash"
                    checked={paymentMethods[user.userId] === 'cash'}
                    onChange={() => handlePaymentMethodChange(user.userId, 'cash')}
                  />
                  Cash
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name={`paymentMethod-${user.userId}`}
                    value="online"
                    checked={paymentMethods[user.userId] === 'online'}
                    onChange={() => handlePaymentMethodChange(user.userId, 'online')}
                  />
                  Online
                </label>
              </div>

              <div className="payment-input">
                <label>Payment Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={paymentAmounts[user.userId]?.paid || 0}
                  onChange={(e) => handlePaymentAmountChange(user.userId, e.target.value)}
                  className="amount-input"
                />
              </div>

              <div className="payment-summary">
                <p>Bill Total: ₹{totalCharge.toFixed(2)}</p>
                <p>Previous: ₹{previousPayments.toFixed(2)}</p>
                <p>Current: ₹{(paymentAmounts[user.userId]?.paid || 0).toFixed(2)}</p>
                <p>Remaining: ₹{(remainingToPay - (paymentAmounts[user.userId]?.paid || 0)).toFixed(2)}</p>
              </div>

              <div className="payment-actions">
                <button
                  onClick={() => submitPayment(user.userId)}
                  className="submit-button"
                  disabled={!paymentMethods[user.userId] || !(paymentAmounts[user.userId]?.paid > 0)}
                >
                  Submit Payment
                </button>
                <button
                  onClick={() => {
                    setShowBillHistory(true);
                    fetchBills(user.userId);
                  }}
                  className="history-button"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {showBillHistory && (
            <BillHistory
              userId={user.userId}
              onClose={() => setShowBillHistory(false)}
            />
          )}
        </td>
      </tr>
    );
  };

  const renderUserRow = (user) => {
    const billTotals = userBillTotals[user.userId] || { completedPayment: 0, duePayment: 0 };
    const netDue = netAmountDue[user.userId] || 0;
    
    return (
      <React.Fragment key={user.userId}>
        <tr
          onClick={() => handleUserSelect(user)}
          className={selectedUser?.userId === user.userId ? "selected" : ""}
        >
          <td>{user.userId}</td>
          <td>{user.name}</td>
          <td className="hide-mobile">{user.phone}</td>
          <td className="text-red">{user.udharTotal}</td>
          <td className="text-green">{user.jamaTotal}</td>
          <td className={user.currentBalance >= 0 ? "text-red" : "text-green"}>
            {user.currentBalance}
          </td>
          <td className="text-green hide-mobile">₹{billTotals.completedPayment.toFixed(2)}</td>
          <td className="text-red">₹{(netDue - billTotals.completedPayment).toFixed(2)}</td>
        </tr>
        {selectedUser?.userId === user.userId && renderBillingDetails(user)}
      </React.Fragment>
    );
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) {
    return (
      <Navbar>
        <div className="error-container">
          <div className="error-message">{error}</div>
        </div>
      </Navbar>
    );
  }

  return (
<Navbar>
      <div className="billing-system">
        <div className="container">
        <div className="flex items-center justify-between p-4 rounded-lg shadow-lg bg-gradient-to-r from-teal-600 to-teal-400">
            <h2 className="text-2xl font-bold tracking-tight text-white">બિલ</h2>
          </div>
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-base text-center">Loading...</p>
              </div>
            </div>
          )}
          <br />
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>નામ</th>
                  <th className="hide-mobile">Phone</th>
                  <th>ઉધાર</th>
                  <th>જમા</th>
                  <th>બેલેન્સ</th>
                  <th className="hide-mobile">Paid</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {userData.map(renderUserRow)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`

          @media (max-width: 640px) {
            .billing-system {
              padding-top: 4rem;
            }
  
            .page-title {
              font-size: 1.5rem;
              margin-bottom: 1.5rem;
            }
  
            .users-table {
              font-size: 0.8rem;
            }
  
            .users-table th,
            .users-table td {
              padding: 0.5rem;
            }
  
            .hide-mobile {
              display: none;
            }
  
            .rate-settings {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
  
            .payment-methods,
            .payment-actions {
              grid-template-columns: 1fr;
            }
  
            .payment-summary {
              grid-template-columns: 1fr;
            }
  
            .billing-details {
              padding: 1rem;
            }
  
            .input-group input {
              padding: 0.5rem;
            }
  
            .bill-history {
              width: 95%;
              padding: 1rem;
            }
          }
  
          @media (max-width: 480px) {
            .users-table {
              font-size: 0.75rem;
            }
  
            .users-table th,
            .users-table td {
              padding: 0.4rem;
            }
  
            .billing-table {
              font-size: 0.75rem;
            }
  
            .payment-section {
              padding: 1rem;
            }
      `}</style>
    </Navbar>
  );
};

export default BillingSystem;