function serializeChefApproval(registration) {
  const chef = registration.createdBy || {}

  return {
    id: String(registration._id),
    reviewStatus: registration.reviewStatus || 'pending',
    isActive: Boolean(registration.isActive),
    createdAt: registration.createdAt,
    reviewedAt: registration.reviewedAt,
    rejectionReason: registration.rejectionReason || '',
    chef: {
      id: chef._id ? String(chef._id) : '',
      name: chef.name || '',
      email: chef.email || '',
      phone: chef.phone || '',
      isRegistered: Boolean(chef.isRegistered),
    },
    kitchenName: registration.kitchenName || '',
    cuisine: registration.cuisine || '',
    speciality: registration.speciality || '',
    experience: registration.experience || '',
    maxOrders: registration.maxOrders || '',
    addressLine: registration.addressLine || '',
    city: registration.city || '',
    state: registration.state || '',
    zip: registration.zip || '',
    nearestStation: registration.nearestStation || '',
    prepTime: registration.prepTime || '',
    openTime: registration.openTime || '',
    closeTime: registration.closeTime || '',
    availableDays: Array.isArray(registration.availableDays) ? registration.availableDays : [],
    documents: {
      idProof: registration.idProof || '',
      chefPhoto: registration.chefPhoto || '',
    },
  }
}

module.exports = {
  serializeChefApproval,
}
