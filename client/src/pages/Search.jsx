import react from 'react'
import { useEffect } from 'react'
import {useState} from 'react'
import { FaLocationArrow } from 'react-icons/fa'
import {useLocation, useNavigate ,} from 'react-router-dom'
import ListingItem from '../components/ListingItem'
function Search(){
    const [sidebarData,setSidebarData] = useState({
        searchTerm : '',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })
     const navigate = useNavigate();
     const location = useLocation();
     const [listings,setListings] = useState([]);
     const [loading,setLoading] = useState(false);

    const handleChange = (e)=>{
        if(e.target.id==='all' || e.target.id==='rent' || e.target.id==='sale'){
            setSidebarData({...sidebarData,type:e.target.id})
        }
        if(e.target.id==='searchTerm'){
            setSidebarData({...sidebarData,searchTerm:e.target.value})
        }
        if(e.target.id === 'parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setSidebarData({...sidebarData,
                [e.target.id] : e.target.checked || e.target.checked==='true' ? true : false })
        }

        if(e.target.id==='sort-order'){
              const sort = e.target.value.split('_')[0] || 'created_at';
              const order = e.target.value.split('_')[1] || 'desc';

              setSidebarData({...sidebarData,sort,order});
        }
    }
    

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
         console.log(urlParams,'dn');
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl 
        || offerFromUrl || sortFromUrl || orderFromUrl){
                setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
                })
        }
         

        const fetchListing = async()=>{
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
           

            setListings(data);
            setLoading(false);

        }
        fetchListing();

    },[location.search])

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('type',sidebarData.type);
         urlParams.set('parking',sidebarData.parking);
        urlParams.set('furnished',sidebarData.furnished);
        urlParams.set('offer',sidebarData.offer);
         urlParams.set('sort',sidebarData.sort);
        urlParams.set('order',sidebarData.order);
        const searchQuery = urlParams.toString();
       navigate(`/search?${searchQuery}`)
    }
    return (
        
        <div className='flex'>
            <div className='border-r-2 min-h-screen p-7'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>

                      <div className='flex items-center gap-2'>
                    <label htmlFor="searchTerm" className='font-semibold'>Search Term:</label>
                    <input 
                    type="text" 
                     id="searchTerm"
                     placeholder="Search..."
                     className='p-3 bg-white rounded-md '
                     value={sidebarData.searchTerm}
                     onChange={handleChange}/>
                     </div>

                     <div className="flex gap-2  items-center flex-wrap">
                        <label className='font-semibold'>Type:</label>
                        <div className='flex items-center gap-1'>
                            <input type="checkbox"
                             id='all'
                            checked={sidebarData.type==='all'}
                            onChange={handleChange}
                             className='w-5 h-5' />
                             <label 
                             htmlFor="all"
                              className='font-semibold'>Rent&Sale</label>
                        </div>
                        <div className='flex items-center gap-1'>
                           
                            <input type="checkbox" id='rent'
                            checked={sidebarData.type==='rent'}
                            onChange={handleChange}
                             className='w-5 h-5'/>
                             <label htmlFor="rent" className='font-semibold'>Rent</label>
                        </div>
                        <div className='flex items-center gap-1'>
                            
                            <input type="checkbox" id='sale'
                             checked={sidebarData.type==='sale'}
                            onChange={handleChange}
                             className='w-5 h-5'/>
                            <label htmlFor="sale" className='font-semibold'>Sale</label>
                        </div>
                        <div className='flex items-center gap-1'>
                            
                            <input type="checkbox" id='offer' 
                             checked={sidebarData.offer}
                            onChange={handleChange}
                            className='w-5 h-5' />
                            <label htmlFor="offer" className='font-semibold'>Offer</label>
                        </div>
                    
                        
                     </div>

                     <div className='flex gap-2'>
                      
                      <label className='font-semibold'>Amenities:</label>
                       <div className='flex items-center gap-1'>
                            <input type="checkbox" id='parking'
                             checked={sidebarData.parking}
                            onChange={handleChange}
                            className='w-5 h-5' />
                             <label htmlFor="parking" className='font-semibold'>Parking</label>
                        </div>
                        <div className='flex items-center gap-1'>
                           
                            <input type="checkbox" id='furnished'
                             checked={sidebarData.furnished}
                            onChange={handleChange}
                            className='w-5 h-5'/>
                             <label htmlFor="furnished" className='font-semibold'>Furnished</label>
                        </div>
 
                     </div>

                     <div >
                        <label className='font-semibold p-2'>Sort:</label>
                        <select id="sort-order" 
                        onChange={handleChange}
                        className="bg-white p-2 rounded-lg">
                            <option value='regularPrice_desc'>Price high to Low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option> 
                        </select>
                     </div> 

                     <button className='p-3 bg-slate-700  cursor-pointer font-semibold
                     text-white rounded-lg hover:opacity-90'>Search</button>
                </form>
            </div>

            <div>
                <h1 className='text-3xl font-semibold p-4'>Listing results:</h1>
                  
                  <div className='p-7 flex flex-wrap gap-6'>
                    {!loading && listings.length===0 && (
                    <p className='text-xl text-slate-700 font-semibold'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}
                {!loading && listings && listings.map((listing)=>(
                         <ListingItem key={listing._id} listing={listing}></ListingItem>
                ))}
                </div>
            </div>
        </div>
        
    )
}

export default Search;