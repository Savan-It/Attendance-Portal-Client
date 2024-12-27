import React, { useState, useEffect } from 'react'
import axios from 'axios';

function AllAttendance() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [attendanceData, setAttendanceData] = useState([]);
   
    

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`https://attendanceserver.onrender.com/all-employees-attendace/${selectedMonth}`);
                setAttendanceData(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error.message);
            }
        };
    fetchAttendanceData()
    }, [selectedMonth]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className='container pt-5 mt-5'>
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="month" className='me-2'>Select Month:</label>
                            <input
                                type="month"
                                id="month"
                                name="month"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            />
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Employee</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map(({ date, attendanceRecords }, index) => (
                                <React.Fragment key={index}>
                                    {attendanceRecords.length > 0 ? (
                                        attendanceRecords.map((record, recordIndex) => (
                                            <tr key={`${index}-${recordIndex}`}>
                                                {recordIndex === 0 && (
                                                    <td rowSpan={attendanceRecords.length}>{date}</td>
                                                )}
                                                <td>{record.employee}</td>
                                                <td>{record.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>{date}</td>
                                            <td colSpan="2">No attendance records</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AllAttendance