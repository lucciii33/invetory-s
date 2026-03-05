type Props = {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({
  itemName,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-[#0f0f17] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold text-white mb-1">
          ¿Eliminar producto?
        </h2>
        <p className="text-sm text-white/40 mb-6">
          <span className="text-white/70">{itemName}</span> será eliminado
          permanentemente.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
