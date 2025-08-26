import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import { MoreHorizontal, MoreVertical } from 'lucide-react'; // ícono de tres puntitos

export function ThreadActionsMenu({
  onRename,
  onArchive,
  onDelete, 
  onOpenChange,
  menuOpen
}: {
  onRename?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onOpenChange: (open: boolean) => void;
  menuOpen:Boolean
}) {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className={clsx("p-1 rounded-md ", menuOpen ? "bg-primary" : "hover:bg-primary" )}>
          <MoreHorizontal className="h-4 w-4 " />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRename} className='cursor-pointer hover:bg-zinc-200'>Cambiar nombre</DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive} className='cursor-pointer hover:bg-zinc-200'>Archivar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600 cursor-pointer hover:bg-red-300">
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
