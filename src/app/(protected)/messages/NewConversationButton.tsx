'use client';

import Button from '@/components/ui/Button';
import { Edit } from '@/svg_components';
import { useOverlayTriggerState } from 'react-stately';
import { NewConversationDialog } from './NewConversationDialog';
import { Modal } from '@/components/Modal';
import { AnimatePresence } from 'framer-motion';

export function NewConversationButton() {
  const state = useOverlayTriggerState({});

  return (
    <>
      <Button onPress={state.open} Icon={Edit} size="medium">
        Новый
      </Button>
      <AnimatePresence>
        {state.isOpen && (
          <Modal state={state}>
            <NewConversationDialog handleClose={state.close} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
