'use client';  // This marks the component as a client component

import React, { useState } from 'react';
import './profileform.css';  // Import the CSS file
import Navdash from '@/components/nav-dash';

// ProfileForm Component
const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    age: '',
    profession: '',
    workHours: '',
    medicalHistory: '',
    medicalDetails: '',
    sleepHours: '',
    allergies: '',
    medication: '',
    chronicConditions: '',
    mentalHealthConcerns: '',
    caffeine: '',
    maritalStatus: '',
    diet: '',
  });

  // Handle input and textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // You can add form submission logic here
  };

  return (
     <>
        <Navdash />
    <div className="page-container">
      <h1 className="form-heading">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="workHours">How many hours do you work?</label>
          <input
            type="number"
            id="workHours"
            name="workHours"
            value={formData.workHours}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="medicalHistory">Do you have any medical history?</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sleepHours">How many hours do you sleep?</label>
          <input
            type="number"
            id="sleepHours"
            name="sleepHours"
            value={formData.sleepHours}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="allergies">Do you have any allergies?</label>
          <textarea
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="medication">Are you on any medication?</label>
          <textarea
            id="medication"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chronicConditions">Do you have any chronic conditions?</label>
          <textarea
            id="chronicConditions"
            name="chronicConditions"
            value={formData.chronicConditions}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mentalHealthConcerns">Do you have any mental health concerns?</label>
          <textarea
            id="mentalHealthConcerns"
            name="mentalHealthConcerns"
            value={formData.mentalHealthConcerns}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="caffeine">How much caffeine do you consume daily?</label>
          <input
            type="number"
            id="caffeine"
            name="caffeine"
            value={formData.caffeine}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maritalStatus">Marital Status</label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
          >
            <option value="">Select Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Diet</label>
          <div>
            <input
              type="radio"
              id="vegetarian"
              name="diet"
              value="vegetarian"
              checked={formData.diet === 'vegetarian'}
              onChange={handleChange}
            />
            <label htmlFor="vegetarian">Vegetarian</label>
          </div>
          <div>
            <input
              type="radio"
              id="nonVegetarian"
              name="diet"
              value="nonVegetarian"
              checked={formData.diet === 'nonVegetarian'}
              onChange={handleChange}
            />
            <label htmlFor="nonVegetarian">Non-Vegetarian</label>
          </div>
          <div>
            <input
              type="radio"
              id="vegan"
              name="diet"
              value="vegan"
              checked={formData.diet === 'vegan'}
              onChange={handleChange}
            />
            <label htmlFor="vegan">Vegan</label>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
};

export default ProfileForm;
