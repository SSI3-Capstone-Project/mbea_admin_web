import axios from '../Auth/axios' // ✅ axios instance ที่แนบ token ให้อัตโนมัติอยู่แล้ว

export async function getAllSubCollections() {
  try {
    const response = await axios.get('/api/operator/subcollections')
    console.log(response)
    return {
      success: true,
      data: response.data.data, // ✅ array ของ subcollections
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Failed to get subcollections:', error)
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export const getSubCollectionById = async (subCollectionID) => {
  try {
    const response = await axios.get(`/api/operator/subcollections/${subCollectionID}`)
    return {
      success: true,
      data: response.data.data, // ✅ ข้อมูลของแบรนด์เดี่ยว
      message: response.data.message || 'Subcollections fetched successfully'
    }
  } catch (error) {
    console.error(`❌ Failed to get Subcollections with ID ${subCollectionID}:`, error)
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export const createSubCollection = async (payload) => {
  try {
    const res = await axios.post('/api/operator/subcollections', payload)
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    if (err.response && err.response.status === 409) {
      return {
        success: false,
        message: 'SubCollection name already exists'
      }
    }

    return {
      success: false,
      message: err.response?.data?.error?.message || 'Something went wrong'
    }
  }
}

export const updateSubCollection = async (subCollectionID, payload) => {
  try {
    const response = await axios.patch(`/api/operator/subcollections/${subCollectionID}`, payload)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return {
        success: false,
        message: 'Subcollection name already exists'
      }
    }
    return {
      success: false,
      message: error.response?.data?.error?.message || 'An error occurred'
    }
  }
}
