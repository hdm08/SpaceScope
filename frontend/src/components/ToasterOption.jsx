import { Toaster } from 'react-hot-toast';

const ToasterOption =() =>(
    <Toaster
    position="top-right"
    toastOptions={{
      duration: 5000,
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
      },
      success: {
        style: {
          background: '#4CAF50',
        },
      },
      error: {
        style: {
          background: '#F44336',
        },
      },
    }}
  />
)

export default ToasterOption;