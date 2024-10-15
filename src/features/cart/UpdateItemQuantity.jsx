import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import {
  decreaseItemQuantity,
  getCurrentQuantity,
  increaseItemQuantity,
} from './cartSlice';

function UpdateItemQuantity({ pizzaId }) {
  const dispatch = useDispatch();
  const quantity = useSelector(getCurrentQuantity(pizzaId));
  return (
    <div className="flex items-center gap-1 md:gap-3">
      <Button
        onClick={() => {
          dispatch(decreaseItemQuantity(pizzaId));
        }}
        type="round"
      >
        -
      </Button>
      <span className="text-sm font-medium">{quantity}</span>
      <Button
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
        type="round"
      >
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
