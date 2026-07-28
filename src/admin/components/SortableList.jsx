import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * SortableList — drag + keyboard reorder wrapper.
 *
 * Props:
 *   items        Array of items (any shape). Each item MUST have a stable id
 *                (either item.id or derived via getItemId).
 *   getItemId    (item, index) => string. Defaults to item.id ?? String(index).
 *                Note: index-based ids don't survive reorder — supply a real id.
 *   onReorder    (nextItems) => void. Called with the reordered array.
 *   renderItem   ({ item, index, dragHandle, isDragging }) => JSX.
 *                Include {dragHandle} where the grip should render.
 *   className    Extra classes for the outer <div>.
 */
export default function SortableList({
  items,
  getItemId,
  onReorder,
  renderItem,
  className = "space-y-3",
}) {
  const idOf = getItemId || ((item, i) => item?.id ?? String(i));
  const ids = items.map((item, i) => idOf(item, i));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, i) => (
            <SortableRow key={ids[i]} id={ids[i]}>
              {({ dragHandle, isDragging }) =>
                renderItem({ item, index: i, dragHandle, isDragging })
              }
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
      title="Drag to reorder (or focus + Space + arrows)"
      aria-label="Drag to reorder"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandle, isDragging })}
    </div>
  );
}
