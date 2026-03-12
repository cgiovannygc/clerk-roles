// tienes que hacer que cada vez que un usuario compre un producto,
// se guarde en su perfil y se muestre en una sección de "Mis compras".

import PurchasesMain from "@src/components/store/purchases/purchasesMain";

export default function PurchasesPage() {
  return (
    <div className="min-h-screen bg-[#d7baa5] px-4 py-8 md:px-8 lg:px-12">
      <PurchasesMain />
    </div>
  );
}
