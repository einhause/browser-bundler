import './action-bar.css';
import { useActions } from '../hooks/use-actions';
import { FaAngleDoubleDown, FaAngleDoubleUp, FaTrashAlt } from 'react-icons/fa';
import ActionBarButton from './action-bar-button';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className='action-bar'>
      <ActionBarButton
        Icon={FaAngleDoubleUp}
        onClick={() => moveCell(id, 'up')}
      />
      <ActionBarButton
        Icon={FaAngleDoubleDown}
        onClick={() => moveCell(id, 'down')}
      />
      <ActionBarButton Icon={FaTrashAlt} onClick={() => deleteCell(id)} />
    </div>
  );
};

export default ActionBar;
