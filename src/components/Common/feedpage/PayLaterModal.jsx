import { getAssetsUrl } from '@/components/utils/helpers'
import React from 'react'

const PayLaterModal = () => {
  const bgImage = getAssetsUrl('webFeed/pay-later-bg.png')

  return (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
      role="img"
      aria-label="Pay Later"
    />
  )
}

export default PayLaterModal