function serializeDeliveryApproval(registration) {
  const deliveryBoy = registration.createdBy || {}

  return {
    id: String(registration._id),
    status: registration.status || 'pending',
    isOnline: Boolean(registration.isOnline),
    createdAt: registration.createdAt,
    reviewedAt: registration.reviewedAt,
    rejectionReason: registration.rejectionReason || '',
    deliveryBoy: {
      id: deliveryBoy._id ? String(deliveryBoy._id) : '',
      name: deliveryBoy.name || registration.name || '',
      mobileNo: deliveryBoy.mobileNo || registration.mobileNo || '',
      isRegistered: Boolean(deliveryBoy.isRegistered),
    },
    name: registration.name || '',
    mobileNo: registration.mobileNo || '',
    email: registration.email || '',
    idType: registration.idType || '',
    idNumber: registration.idNumber || '',
    vehicleNumber: registration.vehicleNumber || '',
    drivingLicenseNumber: registration.drivingLicenseNumber || '',
    address: registration.address || '',
    city: registration.city || '',
    state: registration.state || '',
    pincode: registration.pincode || '',
    nearestStation: registration.nearestStation || '',
    availableDays: Array.isArray(registration.availableDays) ? registration.availableDays : [],
    startTime: registration.startTime || '',
    endTime: registration.endTime || '',
    upiId: registration.upiId || '',
    accountNumber: registration.accountNumber || '',
    ifscCode: registration.ifscCode || '',
    accountHolderName: registration.accountHolderName || '',
    documents: {
      profilePhoto: registration.profilePhoto || '',
      idProofImage: registration.idProofImage || '',
      drivingLicenseImage: registration.drivingLicenseImage || '',
      bikePhoto: registration.bikePhoto || '',
    },
  }
}

module.exports = {
  serializeDeliveryApproval,
}
