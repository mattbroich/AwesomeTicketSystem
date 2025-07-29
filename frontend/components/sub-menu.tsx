"use client"
import { Plus, ArrowLeft, DivideIcon } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface Props {
    title: string,
    subtitle: string,
    showActionButton: boolean,
    page: string,
    setSharedState: React.Dispatch<React.SetStateAction<boolean>>,
}

const SubMenu : React.FC<Props> = ({setSharedState, title, subtitle, showActionButton, page}) => { 
    const router = useRouter();

    return (
        <>
            <div className="col-span-12 flex items-center justify-between mb-6 mt-6 mr-10 ml-10">
                {
                    page != "collections" ?
                    <button
                        onClick={() => router.push('/collections')}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-md"
                        aria-label="Go back to your collections"
                    >
                    <ArrowLeft className="w-5 h-5" />
                </button> :
                null
                }
                <div className="">
                    <h1 className="text-4xl font-extrabold text-purple-700">{title}</h1>
                    <p className="text-md text-gray-500 mt-1">{subtitle}</p>
                </div>
                {
                    showActionButton ?
                    <button
                        onClick={() => setSharedState(true) }
                        title={`Create new ${page}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 
                                    text-white hover:bg-purple-700 transition-colors"
                        >
                        <Plus className="w-5 h-5" />
                    </button> :
                    null
                }
            </div>   
            <div>
                <hr className="text-purple-600"></hr>
            </div>
        </>
        
        
    )
}

export default SubMenu;