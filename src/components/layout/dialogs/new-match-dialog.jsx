import { useDialog } from '@/store';
import { Modal, Button } from '@/components';
import { joinMatch } from '@/lib/api';

export const NewMatchDialog = () => {
  const { isOpen, toggle } = useDialog('newMatchDialog');

  return isOpen ? (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
      }}
      title="New match"
      fixedButton
      buttons={
        <Button className="ml-4" onClick={joinMatch}>
          Confirm
        </Button>
      }
    >
      <p className="mb-2">Do you confirm the creation of the match?</p>
      <p>
        Please note that once your challenge is accepted, canceling the match
        will not be possible!
      </p>
    </Modal>
  ) : null;
};
