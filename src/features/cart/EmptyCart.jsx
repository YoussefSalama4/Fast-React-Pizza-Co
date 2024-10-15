import LinkButton from '../../ui/LinkButton';

function EmptyCart() {
  return (
    <div className="px-6 py-5">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <p className="py-7 font-semibold text-stone-600">
        Your cart is still empty. Start adding some pizzas :)
      </p>
    </div>
  );
}

export default EmptyCart;
