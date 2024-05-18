import { useDialog } from '@/store';
import { Modal } from '@/components';

export const TeamDialog = () => {
  const { isOpen, toggle } = useDialog('teamDialog');

  return isOpen ? (
    <Modal showModal={isOpen} setShowModal={toggle} title="Team">
      <ul>
        <li className="mb-4">
          ruburi —{' '}
          <span className="text-gray-800">
            Founder with 7 years of experience in web engineering.
          </span>{' '}
          <a
            href="https://warpcast.com/ruburi"
            target="_blank"
            className="text-purple-600"
          >
            Warpcast
          </a>
        </li>
        <li>
          Nutella — <span className="text-gray-800">Cool artist.</span>{' '}
          <a
            href="https://twitter.com/DaraPixel"
            target="_blank"
            className="text-blue-600"
          >
            Twitter
          </a>
        </li>
      </ul>
    </Modal>
  ) : null;
};
