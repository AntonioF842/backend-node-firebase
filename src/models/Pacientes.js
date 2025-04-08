export class Pacientes {
    constructor({
      fullName,
      email,
      mobile,
      dateBirth,
      motherTongue,
      govId,
      sex = 'male',
      maritalStatus = 'single',
      nationality = 'european',
      address,
      city,
      zipCode,
      state,
      country,
      district,
      international = false,
      photo,
      otherIds,
      visitType = 'first',
      priority = 'normal',
      appointmentDate,
      appointmentTime,
      notes,
      referrerType,
      fatherName,
      motherName,
      spouseName,
      education,
      alternateContact,
      birthWeight,
      occupation,
      religion,
      ivrLanguage
    }) {
      this.fullName = fullName
      this.email = email
      this.mobile = mobile
      this.dateBirth = dateBirth
      this.motherTongue = motherTongue
      this.govId = govId
      this.sex = sex
      this.maritalStatus = maritalStatus
      this.nationality = nationality
      this.address = address
      this.city = city
      this.zipCode = zipCode
      this.state = state
      this.country = country
      this.district = district
      this.international = international
      this.photo = photo
      this.otherIds = otherIds
      this.visitType = visitType
      this.priority = priority
      this.appointmentDate = appointmentDate
      this.appointmentTime = appointmentTime
      this.notes = notes
      this.referrerType = referrerType
      this.fatherName = fatherName
      this.motherName = motherName
      this.spouseName = spouseName
      this.education = education
      this.alternateContact = alternateContact
      this.birthWeight = birthWeight
      this.occupation = occupation
      this.religion = religion
      this.ivrLanguage = ivrLanguage
    }
  }
  