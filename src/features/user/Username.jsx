import { useSelector } from 'react-redux';
import { getUsername } from './userSlice';

function Username() {
  const username = useSelector(getUsername);
  if (!username) return null;
  return (
    <div className="hidden text-sm font-semibold sm:block">{username}</div>
  );
}

export default Username;
