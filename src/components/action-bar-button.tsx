import { IconType } from 'react-icons';

interface IconButtonProps {
  Icon: IconType;
  onClick: () => void;
}
const ActionBarButton: React.FC<IconButtonProps> = ({ Icon, onClick }) => {
  return (
    <button className='button is-primary is-small' onClick={onClick}>
      <span className='icon'>
        <Icon />
      </span>
    </button>
  );
};
export default ActionBarButton;
