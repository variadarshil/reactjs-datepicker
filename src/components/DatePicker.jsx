import React, { useState } from 'react';
import PredefinedRanges from "../data/predefinedDates.json";
import './DatePicker.css'; 


const DatePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (event) => {
    const selected = new Date(event.target.value);

    // Check if the selected date is a business day (Monday to Friday)
    if (selected.getDay() === 0 || selected.getDay() === 6) {
      alert('Please select a business day (Monday to Friday) for the start date.');
      return;
    }

    setStartDate(selected);
  };

  const handleEndDateChange = (event) => {
    const selected = new Date(event.target.value);

    // Check if the selected date is a business day (Monday to Friday)
    if (selected.getDay() === 0 || selected.getDay() === 6) {
      alert('Please select a business day (Monday to Friday) for the end date.');
      return;
    }

    setEndDate(selected);
  };

  const highlightBusinessDays = (date) => {
    // Check if the date is a business day (Monday to Friday)
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const getCurrentMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
  
    const firstDayOfMonth = new Date(year, month - 1, 1);
    return firstDayOfMonth;
  };


  const getLastMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfLastMonth = new Date(year, month - 1, 1);
    const lastDayOfLastMonth = new Date(year, month, 0);

    const dates = [];
    for (let date = firstDayOfLastMonth; date <= lastDayOfLastMonth; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    return dates;
  };

  const getLastYearDates = () => {
    const today = new Date();
    const lastYear = today.getFullYear() - 1;
  
    const firstDayOfLastYear = new Date(lastYear, 0, 1);
    const lastDayOfLastYear = new Date(lastYear, 11, 31);
  
    const dates = [];
    for (let date = firstDayOfLastYear; date <= lastDayOfLastYear; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
  
    return dates;
  };

  const getCurrentYearDates = () => {
    const today = new Date();
    const year = today.getFullYear();
  
    const firstDayOfYear = new Date(year, 0, 1);
    return firstDayOfYear;
  };

  const handlePredefinedRange = (range) => {
    const today = new Date();
    let start = null;
    let end = today;

    switch (range) {
      case 'today':
        start = new Date(today);
        start.setDate(today.getDate());
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        break;
      case 'last30days':
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'thismonth':
        const dateMonth = getCurrentMonthDates();
        start = new Date(dateMonth);
        break;
      case 'thisyear':
        const dateYear = getCurrentYearDates();
        start = new Date(dateYear);
        break;
      case 'lastmonth':
        const lastMonth = getLastMonthDates();
        start = new Date(lastMonth[0]);
        end = new Date(lastMonth[lastMonth.length - 1]);
        break;
      case 'lastyear':
        const lastYear = getLastYearDates();
        start = new Date(lastYear[0]);
        end = new Date(lastYear[lastYear.length - 1]);
        break;
      default:
        break;
    }

    start = validISODate(start);
    end = validISODate(end)

    setStartDate(start);
    setEndDate(end);
  };

  const validISODate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  return (
    <div>
      <div>
        <label htmlFor="startDatePicker">Start Date:</label>
        <input
          type="date"
          id="startDatePicker"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={handleStartDateChange}
        />
        <label htmlFor="endDatePicker">End Date:</label>
        <input
          type="date"
          id="endDatePicker"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={handleEndDateChange}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        {PredefinedRanges.map((range) => (
          <button className="button-17" key={range.id} onClick={() => handlePredefinedRange(range.name)}>
            {range.value}
          </button>
        ))}
      </div>
      <div>
        <p>Selected Date Range:</p>
        {startDate && endDate && (
          <p>
            {startDate.toISOString().split('T')[0]} to {endDate.toISOString().split('T')[0]}
          </p>
        )}
      </div>
      <div>
        <p>Highlighted Business Days:</p>
        {startDate &&
          endDate &&
          Array.from(
            { length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 },
            (_, index) => new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000)
          ).map((date) => (
            <span
              key={date.toISOString().split('T')[0]}
              style={{
                marginRight: '5px',
                fontWeight: highlightBusinessDays(date) ? 'bold' : 'normal',
              }}
            >
              {date.toISOString().split('T')[0]}
            </span>
          ))}
      </div>
    </div>
  );
};

export default DatePicker;
