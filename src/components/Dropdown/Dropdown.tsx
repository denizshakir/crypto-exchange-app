import {
  Dropdown as DropdownHeroUI,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownMenuProps,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';

interface IDropdownProps<T> extends Pick<DropdownMenuProps, 'onClick'> {
  items: T[];
  keyExtractor: ({ item, index }: { item: T; index: number }) => string;
  renderItem: ({ item, index }: { item: T; index: number }) => string;
  value: string;
  onPress: (item: T) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Dropdown = <T,>(props: IDropdownProps<T>) => {
  const { items, keyExtractor, onClick, onPress, renderItem, size, value } =
    props;

  return (
    <DropdownHeroUI className="w-40" size={size}>
      <DropdownTrigger>
        <Button variant="bordered">{value}</Button>
      </DropdownTrigger>
      <DropdownMenu
        className="w-40 "
        aria-label="Static Actions"
        onClick={onClick}
      >
        {items.map((item, index) => (
          <DropdownItem
            key={keyExtractor({ item, index })}
            onPress={() => onPress(item)}
          >
            {renderItem({ index, item })}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownHeroUI>
  );
};

export default Dropdown;
