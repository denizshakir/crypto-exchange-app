import { FC, useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';

import MarketDataPanel from '../MarketDataPanel/MarketDataPanel';

import {
  getBinanceTrades,
  getBitfinexTrades,
  getHuobiTrades,
  getKrakenTrades,
} from '@/slices/tradesSlice';
import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { EExchange } from '@/types/marketData';

interface ITradesModalProps {
  exchange: EExchange;
  onClose: () => void;
  ticker: string;
}

const TradesModal: FC<ITradesModalProps> = (props) => {
  const { onClose, exchange, ticker } = props;

  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.trades.data);

  const [isOpen, setIsOpen] = useState(true);

  const handleOnClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 100);
  }, [onClose]);

  useEffect(() => {
    const handlers: Record<EExchange, () => void> = {
      [EExchange.BINANCE]: () => dispatch(getBinanceTrades(ticker)),
      [EExchange.BITFINEX]: () => dispatch(getBitfinexTrades(ticker)),
      [EExchange.KRAKEN]: () => dispatch(getKrakenTrades(ticker)),
      [EExchange.HUOBI]: () => dispatch(getHuobiTrades(ticker)),
    };
    const handler = handlers[exchange];
    handler();
  }, [dispatch, exchange, ticker]);

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalContent>
        <ModalHeader>Last trades</ModalHeader>
        <ModalBody>
          <MarketDataPanel data={data} ticker={ticker} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TradesModal;
