import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductCard = ({ name, price, image, description, quantity, onAdd, onRemove }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex">
    <img 
      src={image} 
      alt={name} 
      className="w-32 h-32 object-cover" 
    />
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-orange-600">€{price.toFixed(2)}</p>
        
        {quantity > 0 ? (
          <div className="flex items-center gap-3 bg-orange-50 rounded-full p-1">
            <button 
              className="w-8 h-8 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <RemoveIcon className="w-4 h-4 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-800 min-w-[20px] text-center">{quantity}</span>
            <button 
              className="w-8 h-8 bg-orange-500 rounded-full shadow-sm hover:bg-orange-600 transition-all duration-200 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              <AddIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <button 
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <AddIcon className="w-4 h-4" />
            Add
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProductCard;