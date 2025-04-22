import axios from '../Auth/axios' // ✅ axios instance ที่แนบ token ให้อัตโนมัติอยู่แล้ว

export async function getAllBrands() {
  try {
    const response = await axios.get('/api/operator/brands')
    console.log(response)
    return {
      success: true,
      data: response.data.data, // ✅ array ของ brands
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Failed to get brands:', error)
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export const createBrand = async (payload) => {
  try {
      const res = await axios.post('/api/operator/brands', payload)
      return {
          success: true,
          data: res.data
      }
  } catch (err) {
      if (err.response && err.response.status === 409) {
          return {
              success: false,
              message: 'Brand name already exists'
          }
      }

      return {
          success: false,
          message: err.response?.data?.error?.message || 'Something went wrong'
      }
  }
}

export const updateBrand = async (brandID, payload) => {
  try {
      const response = await axios.patch(`/api/operator/brands/${brandID}`, payload)
      return {
          success: true,
          data: response.data
      }
  } catch (error) {
      return {
          success: false,
          message: error.response?.data?.error?.message || 'An error occurred'
      }
  }
}
