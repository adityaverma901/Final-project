'use client'; // Mark as a client component

import React, { useState, useEffect } from 'react'; // Import React explicitly
import { useParams } from 'next/navigation'; // Use next/navigation instead of next/router
import styles from './[id].module.css'; // Import the CSS for the page

const DoctorDetails = () => {
    const params = useParams(); // Use useParams to get the dynamic route parameters
    const id = params?.id; // Safely access the 'id'

    const [doctor, setDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
    const [appointmentData, setAppointmentData] = useState({
        name: '',
        email: '',
        appointmentDate: '',
        reason: ''
    }); // State to handle form data

    // Fetch doctor details when the 'id' parameter is available
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/doctors/${id}`)
                .then((res) => res.json())
                .then((data) => setDoctor(data))
                .catch((error) => {
                    console.error("Error fetching doctor data:", error);
                });
        }
    }, [id]); // Only re-run this effect when 'id' changes

    const handleChange = (e) => {
        setAppointmentData({
            ...appointmentData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the appointment data to the backend
        fetch('http://localhost:5000/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Appointment booked:', data);
                setIsModalOpen(false); // Close the modal after successful submission
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
            });
    };

    if (!doctor) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles['doctor-container']}>
            <img
                src={doctor.image_url}
                alt={doctor.name}
                className={styles['doctor-image']}
            />
            <div className={styles['doctor-info']}>
                <h1>{doctor.name}</h1>
                <p><span className={styles['highlight']}>Specialty:</span> {doctor.specialty}</p>
                <div className={styles['doctor-details']}>
                    <p><strong>Experience:</strong> {doctor.experience}</p>
                    <p><strong>Contact:</strong> {doctor.contact}</p>
                    <p><strong>Address:</strong> {doctor.address}</p>
                    <p><strong>Education:</strong> {doctor.education}</p>
                    <p><strong>Languages:</strong> {doctor.languages}</p>
                    <p><strong>Consultation Fee:</strong> {doctor.fee}</p>
                </div>
                <div className={styles['button-container']}>
                    <button onClick={() => setIsModalOpen(true)} className={styles.bookAppointmentBtn}>Book an Appointment</button>
                </div>
            </div>

            {/* Modal for Appointment Form */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Book an Appointment</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                name="name"
                                value={appointmentData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                name="email"
                                value={appointmentData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="date"
                                name="appointmentDate"
                                value={appointmentData.appointmentDate}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                placeholder="Reason for Consultation"
                                name="reason"
                                value={appointmentData.reason}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit">Submit Appointment</button>
                        </form>
                        <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDetails;
