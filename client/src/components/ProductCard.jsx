const ProductCard = ({ name, price, image, quantity, onAdd, onRemove }) => (
    <div className="bg-base-100 rounded-xl shadow-md flex items-center space-x-4 p-4">
      <img src={image} alt={name} className="w-16 h-16 rounded-md object-cover" />
      <div className="flex-1">
        <h3 className="text-md font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">€{price.toFixed(2)}</p>
      </div>
  
      {quantity > 0 ? (
        <div className="flex items-center space-x-2">
          <button className="btn btn-sm btn-outline btn-circle" onClick={onRemove}>-</button>
          <span className="font-semibold">{quantity}</span>
          <button className="btn btn-sm btn-outline btn-circle" onClick={onAdd}>+</button>
        </div>
      ) : (
        <button className="btn btn-sm btn-primary rounded-full" onClick={onAdd}>+</button>
      )}
    </div>
  );
  
  export default ProductCard;
  