import { useEffect, useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import store from '../../store';
import EmptyCart from '../cart/EmptyCart';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress, getUser, getUsername } from '../user/userSlice';
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const [withPriority, setWithPriority] = useState(false);
  const isSubmitting = navigation.state === 'submitting';
  const cartTotalPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority
    ? Math.round((cartTotalPrice * 20) / 100)
    : 0;
  const totalPrice = cartTotalPrice + priorityPrice;
  const formErrors = useActionData();
  const cart = useSelector(getCart);
  const dispatch = useDispatch();
  const username = useSelector(getUsername);
  const {
    status: addressStatus,
    position,
    address,
    error,
  } = useSelector(getUser);
  const [userAddress, setUserAddress] = useState('');

  useEffect(
    function () {
      setUserAddress(address);
    },
    [address],
  );

  const isLoadingAddress = addressStatus === 'loading';
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">First Name</label>

          <input
            defaultValue={username.split(' ')[0]}
            type="text"
            className="input grow"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-3 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-3 text-xs text-red-700">
                {error}
              </p>
            )}
          </div>
          <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
            <Button
              disabled={isLoadingAddress}
              type="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
                setUserAddress(address);
              }}
            >
              {isLoadingAddress ? 'Loading....' : 'Get your position'}
            </Button>
          </span>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 cursor-pointer accent-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)}></input>
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ''
            }
          ></input>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? 'Ordering...'
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };
  console.log(order);
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please, give us a correct phone number. we might need it to contact you.';
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
