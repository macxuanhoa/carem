import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default async function PrintDepositPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.xeMuaVao.findUnique({
    where: { id: parseInt(id) }
  });

  if (!car) notFound();

  return (
    <div className="bg-white min-h-screen text-black p-10 font-serif">
      <div className="max-w-2xl mx-auto border border-black p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase mb-1">Giấy Biên Nhận Tiền Cọc</h1>
            <p className="italic">Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Tôi tên là: <strong>Cà Rem (Đại diện Salon)</strong></p>
            <p>Số điện thoại: 0912.345.678</p>
            
            <p className="mt-4">Hôm nay, tôi có nhận số tiền cọc của Ông/Bà: ................................................................</p>
            <p>Số điện thoại: ................................................................</p>
            
            <p className="mt-4">Số tiền là: <strong className="text-lg">{formatCurrency(car.soTienCoc)}</strong></p>
            <p>(Bằng chữ: ........................................................................................................)</p>
            
            <p className="mt-4">Về việc mua chiếc xe:</p>
            <ul className="list-disc list-inside ml-4">
                <li>Nhãn hiệu: <strong>{car.dongXe}</strong></li>
                <li>Biển số: <strong>{car.bienSo || '....................'}</strong></li>
                <li>Số khung: {car.soKhung || '....................'}</li>
                <li>Số máy: {car.soMay || '....................'}</li>
            </ul>

            <p className="mt-4">Giá bán thỏa thuận: <strong>{formatCurrency(car.tongGiaMua + 5000000)}</strong> (Ví dụ)</p>
            <p>Thời hạn giao xe: ................................................................</p>
            
            <p className="mt-4 font-bold italic">Lưu ý: Nếu bên mua không lấy xe đúng hẹn sẽ mất cọc. Nếu bên bán không giao xe đúng hẹn sẽ đền bù gấp đôi số tiền cọc.</p>
        </div>

        {/* Signature */}
        <div className="flex justify-between mt-12 text-center">
            <div>
                <p className="font-bold mb-16">Người Giao Tiền</p>
                <p>(Ký, ghi rõ họ tên)</p>
            </div>
            <div>
                <p className="font-bold mb-16">Người Nhận Tiền</p>
                <p>Cà Rem</p>
            </div>
        </div>

      </div>

      {/* Print Button (Hide when printing) */}
      <div className="fixed bottom-10 right-10 print:hidden">
          <button 
            // onClick="window.print()" - Note: Inline JS handlers don't work in Server Components directly, 
            // but we can use a small client wrapper or just let user use Ctrl+P
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl font-bold hover:bg-blue-700"
          >
            🖨️ In Giấy Cọc (Ctrl + P)
          </button>
      </div>
      
      <style>{`
        @media print {
            @page { margin: 0; }
            body { padding: 20px; }
        }
      `}</style>
    </div>
  );
}