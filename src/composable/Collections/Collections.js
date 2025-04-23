import axios from '../Auth/axios' // ✅ axios instance ที่แนบ token ให้อัตโนมัติอยู่แล้ว

export async function getAllCollections(params = {}) {
  try {
    const response = await axios.get('/api/operator/collections', { params })
    console.log(response)
    return {
      success: true,
      data: response.data.data, // ✅ array ของ Collections
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Failed to get Collections:', error)
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export const getCollectionById = async (collectionID) => {
  try {
    const response = await axios.get(`/api/operator/collections/${collectionID}`)
    return {
      success: true,
      data: response.data.data, // ✅ ข้อมูลของแบรนด์เดี่ยว
      message: response.data.message || 'Collection fetched successfully'
    }
  } catch (error) {
    console.error(`❌ Failed to get collection with ID ${collectionID}:`, error)
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export const createCollection = async (payload) => {
  try {
    const res = await axios.post('/api/operator/collections', payload)
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    if (err.response && err.response.status === 409) {
      return {
        success: false,
        message: 'Collection name already exists'
      }
    }

    return {
      success: false,
      message: err.response?.data?.error?.message || 'Something went wrong'
    }
  }
}

export const updateCollection = async (collectionID, payload) => {
  try {
    const response = await axios.patch(`/api/operator/collections/${collectionID}`, payload)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return {
        success: false,
        message: 'Collection name already exists'
      }
    }

    return {
      success: false,
      message: error.response?.data?.error?.message || 'An error occurred'
    }
  }
}
