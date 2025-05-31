import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
function ListingItem({listing}){
    console.log(listing)
    return (
        <div className='rounded-lg w-[310px] bg-white overflow-hidden'>
          <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]}
          className='h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
          />
          <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
            <div className='flex items-center gap-1'>
             <MdLocationOn  className='w-4 h-4 text-green-700'/>
             <p className='text-sm text-gray-700 truncate font-semibold'>{listing.address}</p>
            </div>
             <p className='text-sm text-gray-700 font-semibold'>{listing.description}</p>

             <p className='font-semibold text-slate-600 mt-2'>
                $
                {listing.regularPrice.toLocaleString('en-US')}
                {listing.type==='rent' && ' / month'}
             </p>

             <div className='flex gap-4 '>
                <div>
                    <p className='font-bold text-sm'>{listing.bedrooms===1 ? `${listing.bedrooms} bed` : `${listing.bedrooms} bed`}</p>
                </div>
                <div>
                    <p className='font-bold text-sm'>{listing.bathrooms===1 ? `${listing.bathrooms} bath` : `${listing.bathrooms} bed`}</p>
                </div>
             </div>
          </div>
          

          </Link>
        </div>
    )
}

export default ListingItem;