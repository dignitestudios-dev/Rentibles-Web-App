import { Submitted_img } from '@/public/images/export'
import Image from 'next/image'


const ProfileStatus = () => {
  return (
    <div className=''>
        <Image src={Submitted_img} alt='Submitted_img' />
    </div>
  )
}

export default ProfileStatus