"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';
import axios from 'axios'


const AddStorePage = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {

  const checkMobile = () => {

    const mobile = window.innerWidth < 768;

    setIsMobile(mobile);

    if (mobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(false);
    }

  };

  checkMobile();

  window.addEventListener('resize', checkMobile);

  return () =>
    window.removeEventListener('resize', checkMobile);

}, []);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

const closeSidebar = () => {
  setIsSidebarOpen(false);
};


  const [storeInfo, setStoreInfo] = useState({
    phone: '', fullName: '', companyName: '', type: '',
    fullAddress: '', landmark: '', pincode: '', state: '',
    city: '', alternateNumber: '', email: ''
  });

  const [menuDetails, setMenuDetails] = useState({
    numberOfItems: '', numberOfItemTypes: '', openingTime: '', closingTime: ''
  });

  const [items, setItems] = useState([
    { id: 'ITEM001', name: '', category: '', taxRate: '', unitPrice: '', quantity: '', quantityType: '', images: [] }
  ]);

  const [categories, setCategories] = useState(['Beverages', 'Appetizers', 'Main Course', 'Desserts']);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [admins, setAdmins] = useState([{ name: '', email: '', role: '' }]);
  const [branches, setBranches] = useState([{ address: '', city: '', pincode: '', phone: '' }]);
  const [otherDetails, setOtherDetails] = useState({
    billingType: '', gstinNumber: '', msmeNumber: '', paymentMethod: '', nameOnPayment: ''
  });

  const [loading, setLoading] = useState(false);

  const handleStoreInfoChange = (f, v) => setStoreInfo({ ...storeInfo, [f]: v });
  const handleMenuDetailsChange = (f, v) => setMenuDetails({ ...menuDetails, [f]: v });
  const handleItemChange = (i, f, v) => { const n = [...items]; n[i][f] = v; setItems(n); };
  const addItem = () => setItems([...items, { id: `ITEM${String(items.length + 1).padStart(3, '0')}`, name: '', category: '', taxRate: '', unitPrice: '', quantity: '', quantityType: '', images: [] }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const addCategory = () => { if (newCategory && !categories.includes(newCategory)) { setCategories([...categories, newCategory]); setNewCategory(''); setShowCategoryInput(false); } };
  const handleAdminChange = (i, f, v) => { const n = [...admins]; n[i][f] = v; setAdmins(n); };
  const addAdmin = () => setAdmins([...admins, { name: '', email: '', role: '' }]);
  const removeAdmin = (i) => setAdmins(admins.filter((_, idx) => idx !== i));
  const handleBranchChange = (i, f, v) => { const n = [...branches]; n[i][f] = v; setBranches(n); };
  const addBranch = () => setBranches([...branches, { address: '', city: '', pincode: '', phone: '' }]);
  const removeBranch = (i) => setBranches(branches.filter((_, idx) => idx !== i));
  const handleOtherDetailsChange = (f, v) => setOtherDetails({ ...otherDetails, [f]: v });

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white placeholder-gray-400";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1";

  const handleCreateStore = async () => {

  try {

    setLoading(true);

    const payload = {

      storeInfo,
      menuDetails,
      items,
      admins,
      branches,
      otherDetails,

    };

    console.log(
      "STORE PAYLOAD:",
      payload
    );

    const response =
      await axios.post(

        `${process.env.NEXT_PUBLIC_URL}/store/create`,

        payload

      );

    console.log(
      "STORE RESPONSE:",
      response.data
    );

    alert(
      "Store created successfully"
    );

  } catch (error) {

    console.log(error);

    alert(

      error?.response?.data?.message ||

      "Failed to create store"

    );

  } finally {

    setLoading(false);

  }

};

  const SectionHeader = ({ num, title, icon, color }) => (
    <div className="flex items-center gap-3 mb-5">
      <div style={{ background: color || '#6366f1' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {icon || num}
      </div>
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
  );

  const steps = [
    { num: '01', label: 'Store Information' },
    { num: '02', label: 'Menu Details' },
    { num: '03', label: 'Add Items' },
    { num: '04', label: 'Admin / Member' },
    { num: '05', label: 'Sub Branch Details' },
    { num: '06', label: 'Other Details' },
  ];

  const stepColors = ['#f97316', '#10b981', '#6366f1', '#3b82f6', '#ec4899', '#f59e0b'];

return (

<div className="min-h-screen bg-[#f1f2f8]">

  <Sidebar
    isSidebarOpen={isSidebarOpen}
    onClose={closeSidebar}
  />

  <Navbar
    onMenuClick={toggleSidebar}
    isSidebarOpen={isSidebarOpen}
  />

  <div
    className={`transition-all duration-300 pt-20 ${
      !isMobile &&
      (isSidebarOpen ? 'ml-64' : 'ml-20')
    }`}
  >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .step-dot::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background: #d1d5db;
          min-height: 40px;
        }
        .step-dot:last-child::after { display: none; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
      `}</style>

      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center gap-3">
        
       
        <h1 className="text-lg font-bold text-gray-900">Add New Store</h1>
        <a href="#" className="ml-2 text-sm text-indigo-500 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
          Learn More
        </a>
      </div>

      <div className="flex gap-5 p-5 max-w-screen-xl mx-auto">
        {/* Left Steps + Forms */}
        <div className="flex-1 min-w-0">
          <div className="relative pl-20">

  {/* Global Timeline Line */}
  <div
    className="absolute left-5 top-10 bottom-10 w-[2px] bg-gray-300"
  />
            {/* Step Numbers Column */}



            {/* Forms */}
            <div className="flex-1 space-y-4">

              {/* 01 Store Information */}
              <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>
  <div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>
  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    01
  </div>

  <div
    className="absolute top-10 w-[2px] bg-gray-300"
    style={{
  height: 'calc(100% + 32px)',
}}
  />
</div>
  
                <SectionHeader num="01" title="Store Information" color={stepColors[0]} icon={
                  <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                } />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Phone <span className="text-red-400">*</span></label>
                    <div className="flex gap-2">
                      <select className="px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" style={{ width: 72 }}>
                        <option>🇮🇳 +91</option><option>+1</option><option>+44</option>
                      </select>
                      <input type="tel" value={storeInfo.phone} onChange={e => handleStoreInfoChange('phone', e.target.value)} placeholder="Enter Phone" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                    <input type="text" value={storeInfo.fullName} onChange={e => handleStoreInfoChange('fullName', e.target.value)} placeholder="Enter Full Name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Company Name <span className="text-red-400">*</span></label>
                    <input type="text" value={storeInfo.companyName} onChange={e => handleStoreInfoChange('companyName', e.target.value)} placeholder="Enter Company Name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Type <span className="text-red-400">*</span></label>
                    <select value={storeInfo.type} onChange={e => handleStoreInfoChange('type', e.target.value)} className={inputCls}>
                      <option value="">Select Type</option>
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="cafe">Cafe</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Full Address <span className="text-red-400">*</span></label>
                    <input type="text" value={storeInfo.fullAddress} onChange={e => handleStoreInfoChange('fullAddress', e.target.value)} placeholder="Enter Full Address" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Landmark</label>
                    <input type="text" value={storeInfo.landmark} onChange={e => handleStoreInfoChange('landmark', e.target.value)} placeholder="Enter Landmark" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Pincode <span className="text-red-400">*</span></label>
                    <input type="text" value={storeInfo.pincode} onChange={e => handleStoreInfoChange('pincode', e.target.value)} placeholder="Enter Pincode" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>State <span className="text-red-400">*</span></label>
                    <select value={storeInfo.state} onChange={e => handleStoreInfoChange('state', e.target.value)} className={inputCls}>
                      <option value="">Select State</option>
                      <option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>City <span className="text-red-400">*</span></label>
                    <input type="text" value={storeInfo.city} onChange={e => handleStoreInfoChange('city', e.target.value)} placeholder="Select City" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Alternate Number</label>
                    <div className="flex gap-2">
                      <select className="px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" style={{ width: 72 }}>
                        <option>🇮🇳 +91</option>
                      </select>
                      <input type="tel" value={storeInfo.alternateNumber} onChange={e => handleStoreInfoChange('alternateNumber', e.target.value)} placeholder="Alternate Number" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                    <input type="email" value={storeInfo.email} onChange={e => handleStoreInfoChange('email', e.target.value)} placeholder="Enter Email ID" className={inputCls} />
                  </div>
                </div>
                
              </div>

              {/* 02 Menu Details */}
               <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>

<div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>
  
  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    02
  </div>

</div>
  
                <SectionHeader num="02" title="Menu Details" color={stepColors[1]} icon={
                  <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                } />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>Number of Items</label>
                    <input type="number" value={menuDetails.numberOfItems} onChange={e => handleMenuDetailsChange('numberOfItems', e.target.value)} placeholder="e.g. 50" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Number of Item Types</label>
                    <input type="number" value={menuDetails.numberOfItemTypes} onChange={e => handleMenuDetailsChange('numberOfItemTypes', e.target.value)} placeholder="e.g. 5" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Opening Time</label>
                    <input type="time" value={menuDetails.openingTime} onChange={e => handleMenuDetailsChange('openingTime', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Closing Time</label>
                    <input type="time" value={menuDetails.closingTime} onChange={e => handleMenuDetailsChange('closingTime', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

                <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>
  <div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>  
  
  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    03
  </div>
</div>
  
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: stepColors[2] }}>
                      <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-800">Add Items</h2>
                  </div>
                  <button type="button" onClick={() => setShowCategoryInput(!showCategoryInput)}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    + Add Category
                  </button>
                </div>

                {showCategoryInput && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg flex gap-2">
                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter new category" className={inputCls} />
                    <button type="button" onClick={addCategory} className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg">Add</button>
                    <button type="button" onClick={() => setShowCategoryInput(false)} className="px-3 py-1.5 bg-gray-400 text-white text-sm rounded-lg">✕</button>
                  </div>
                )}

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10 }} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Product Name <span className="text-red-400">*</span></label>
                          <input type="text" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder="Enter Product Name" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>SKU</label>
                          <input type="text" value={item.id} readOnly className={`${inputCls} bg-gray-100`} />
                        </div>
                        <div>
                          <label className={labelCls}>Category</label>
                          <select value={item.category} onChange={e => handleItemChange(index, 'category', e.target.value)} className={inputCls}>
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Quantity <span className="text-red-400">*</span></label>
                          <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} placeholder="Enter Quantity" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Unit Price (₹) <span className="text-red-400">*</span></label>
                          <input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} placeholder="Enter Unit Price" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Tax Rate % (Optional)</label>
                          <input type="number" value={item.taxRate} onChange={e => handleItemChange(index, 'taxRate', e.target.value)} placeholder="Enter Tax Rate" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Quantity Type</label>
                          <select value={item.quantityType} onChange={e => handleItemChange(index, 'quantityType', e.target.value)} className={inputCls}>
                            <option value="">Select</option>
                            <option value="kg">KG</option><option value="g">G</option>
                            <option value="ltr">LTR</option><option value="ml">ML</option>
                            <option value="piece">Piece</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addItem}
                    className="flex items-center gap-2 text-sm text-indigo-500 font-medium hover:text-indigo-700 transition-colors mt-1">
                    <span className="w-5 h-5 rounded-full border-2 border-indigo-400 flex items-center justify-center text-xs">+</span>
                    Add Another
                  </button>
                </div>

                {/* Payment sub-section */}
                <div style={{ borderTop: '1px solid #e5e7eb' }} className="mt-5 pt-4 flex flex-wrap items-center gap-6">
                 
                  
                  <div className="ml-auto text-sm font-medium text-gray-700">
                    Sub Total <span className="ml-2 text-gray-900">₹{items.reduce((sum, i) => sum + (parseFloat(i.unitPrice) || 0) * (parseFloat(i.quantity) || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-3">
                 
                  <div className="ml-auto text-sm font-medium text-gray-700">
                    Total (Prepaid) <span className="ml-2 text-gray-900">₹{items.reduce((sum, i) => sum + (parseFloat(i.unitPrice) || 0) * (parseFloat(i.quantity) || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

               <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>
  <div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>
  
  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    04
  </div>

</div>
  
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: stepColors[3] }}>
                      <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-800">Add Admin / Member</h2>
                  </div>
                  <button type="button" onClick={addAdmin} className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    + Add Admin
                  </button>
                </div>
                <div className="space-y-3">
                  {admins.map((admin, index) => (
                    <div key={index} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10 }} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Admin {index + 1}</span>
                        {admins.length > 1 && <button type="button" onClick={() => removeAdmin(index)} className="text-xs text-red-500">Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Name</label>
                          <input type="text" placeholder="Name" value={admin.name} onChange={e => handleAdminChange(index, 'name', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Email</label>
                          <input type="email" placeholder="Email" value={admin.email} onChange={e => handleAdminChange(index, 'email', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Role</label>
                          <select value={admin.role} onChange={e => handleAdminChange(index, 'role', e.target.value)} className={inputCls}>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>
  <div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>
  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    05
  </div>

</div>
  
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: stepColors[4] }}>
                      <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-800">Sub Branch Details</h2>
                  </div>
                  <button type="button" onClick={addBranch} className="px-3 py-1.5 text-xs font-medium text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors">
                    + Add Branch
                  </button>
                </div>
                <div className="space-y-3">
                  {branches.map((branch, index) => (
                    <div key={index} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10 }} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Branch {index + 1}</span>
                        {branches.length > 1 && <button type="button" onClick={() => removeBranch(index)} className="text-xs text-red-500">Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <label className={labelCls}>Address</label>
                          <input type="text" placeholder="Address" value={branch.address} onChange={e => handleBranchChange(index, 'address', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>City</label>
                          <input type="text" placeholder="City" value={branch.city} onChange={e => handleBranchChange(index, 'city', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Pincode</label>
                          <input type="text" placeholder="Pincode" value={branch.pincode} onChange={e => handleBranchChange(index, 'pincode', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Phone</label>
                          <input type="tel" placeholder="Phone" value={branch.phone} onChange={e => handleBranchChange(index, 'phone', e.target.value)} className={inputCls} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                <div
  className="relative p-5"
  style={{
    background: 'white',
    borderRadius: 12,
    border: '1px solid #e5e7eb'
  }}
>
  {/* Timeline Step */}
<div
  className="absolute -left-20 top-8 flex flex-col items-center"
>
  <div
  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300"
  style={{
    width: '40px',
  }}
/>

  <div
    className="w-10 h-10 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-sm font-bold z-10"
  >
    06
  </div>
</div>
  
                <SectionHeader num="06" title="Other Details" color={stepColors[5]} icon={
                  <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth={2}/></svg>
                } />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Billing Type</label>
                    <select value={otherDetails.billingType} onChange={e => handleOtherDetailsChange('billingType', e.target.value)} className={inputCls}>
                      <option value="">Select</option>
                      <option value="gst">GST</option>
                      <option value="non-gst">Non-GST</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>GSTIN Number</label>
                    <input type="text" value={otherDetails.gstinNumber} onChange={e => handleOtherDetailsChange('gstinNumber', e.target.value)} placeholder="Enter GSTIN Number" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>MSME Number (Optional)</label>
                    <input type="text" value={otherDetails.msmeNumber} onChange={e => handleOtherDetailsChange('msmeNumber', e.target.value)} placeholder="Enter MSME Number" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Payment Method</label>
                    <select value={otherDetails.paymentMethod} onChange={e => handleOtherDetailsChange('paymentMethod', e.target.value)} className={inputCls}>
                      <option value="">Select</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Name on Payment</label>
                    <input type="text" value={otherDetails.nameOnPayment} onChange={e => handleOtherDetailsChange('nameOnPayment', e.target.value)} placeholder="Enter Name on Payment" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Store Preview */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', position: 'sticky', top: 20 }}>
            {/* Map placeholder */}
            <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #ddd6fe 100%)', borderRadius: '12px 12px 0 0', height: 120, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 300 120" className="w-full h-full opacity-30">
                <path d="M0 60 Q75 20 150 60 Q225 100 300 60" stroke="#6366f1" strokeWidth="2" fill="none"/>
                <path d="M0 80 Q75 40 150 80 Q225 120 300 80" stroke="#818cf8" strokeWidth="1.5" fill="none"/>
                <circle cx="150" cy="60" r="6" fill="#6366f1"/>
                <circle cx="80" cy="75" r="4" fill="#818cf8"/>
                <circle cx="220" cy="45" r="4" fill="#818cf8"/>
              </svg>
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', borderRadius: 6, padding: '2px 6px', fontSize: 11, color: '#6366f1', fontWeight: 600 }}>Store Location</div>
              <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button style={{ width: 24, height: 24, background: 'white', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                <button style={{ width: 24, height: 24, background: 'white', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              </div>
            </div>

            <div className="p-4">
              {/* Store identity */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {storeInfo.companyName ? storeInfo.companyName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{storeInfo.companyName || 'Store Name'}</p>
                  <p className="text-xs text-gray-400 truncate">{storeInfo.type || 'Type not set'}</p>
                </div>
              </div>

              {/* Preview rows */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Contact</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">📞</span> {storeInfo.phone || <span className="text-gray-300">Not provided</span>}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <span className="text-gray-400">✉️</span> {storeInfo.email || <span className="text-gray-300">Not provided</span>}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Address</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {storeInfo.fullAddress || <span className="text-gray-300">Not provided</span>}
                    {(storeInfo.city || storeInfo.state) && <><br />{[storeInfo.city, storeInfo.state].filter(Boolean).join(', ')} {storeInfo.pincode}</>}
                  </p>
                </div>

                {items.some(i => i.name) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Menu Items ({items.filter(i => i.name).length})</p>
                    <div className="space-y-1">
                      {items.filter(i => i.name).slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate">{item.name}</span>
                          <span className="text-gray-800 font-medium ml-2">₹{item.unitPrice || '—'}</span>
                        </div>
                      ))}
                      {items.filter(i => i.name).length > 3 && (
                        <p className="text-xs text-gray-400">+{items.filter(i => i.name).length - 3} more</p>
                      )}
                    </div>
                  </div>
                )}

                {(menuDetails.openingTime || menuDetails.closingTime) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Hours</p>
                    <p className="text-xs text-gray-600">{menuDetails.openingTime || '--:--'} – {menuDetails.closingTime || '--:--'}</p>
                  </div>
                )}

                {admins.some(a => a.name) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Team ({admins.filter(a => a.name).length})</p>
                    <div className="flex flex-wrap gap-1">
                      {admins.filter(a => a.name).map((admin, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{admin.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {otherDetails.gstinNumber && (
                  <div style={{ borderTop: '1px solid #f3f4f6' }} className="pt-3">
                    <p className="text-xs text-gray-400">GSTIN: {otherDetails.gstinNumber}</p>
                  </div>
                )}
              </div>

              {/* Total & CTA */}
              <div style={{ borderTop: '1px solid #e5e7eb' }} className="mt-4 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Total (Incl. GST)</span>
                  <span className="text-base font-bold text-gray-900">
                    ₹{items.reduce((sum, i) => {
                      const base = (parseFloat(i.unitPrice) || 0) * (parseFloat(i.quantity) || 0);
                      const tax = base * ((parseFloat(i.taxRate) || 0) / 100);
                      return sum + base + tax;
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-1.5">
                  <span>ℹ️</span>
                  <span>Tax rates applied per item where specified</span>
                </div>
                <button
  onClick={handleCreateStore}
  style={{
    background:
      'linear-gradient(to bottom, #60a5fa, #4f46e5)',
    width: '100%',
    padding: '10px',
    borderRadius: 8,
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  }}
>

{
  loading
    ? "Creating..."
    : "Add Store"
}

</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  );
};

export default AddStorePage;