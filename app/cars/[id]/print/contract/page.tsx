import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default async function PrintContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.xeMuaVao.findUnique({
    where: { id: parseInt(id) }
  });

  if (!car) notFound();

  return (
    <div className="bg-white min-h-screen text-black p-10 font-serif">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-6">
            <h3 className="font-bold uppercase text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
            <p className="font-bold underline text-sm mb-4">Độc lập - Tự do - Hạnh phúc</p>
            <h1 className="text-2xl font-bold uppercase">HỢP ĐỒNG MUA BÁN XE</h1>
        </div>

        <div className="space-y-4 text-justify leading-relaxed text-sm">
            <p>Hôm nay, ngày .... tháng .... năm 20..., tại Salon Cà Rem, chúng tôi gồm:</p>

            <div className="mb-4">
                <h3 className="font-bold uppercase bg-gray-100 p-1">BÊN BÁN (BÊN A):</h3>
                <p>Ông/Bà: <strong>NGUYỄN VĂN A (Đại diện Salon Cà Rem)</strong></p>
                <p>CMND/CCCD số: ................................. Cấp ngày: .................... Tại: ....................</p>
                <p>Địa chỉ: ........................................................................................................</p>
            </div>

            <div className="mb-4">
                <h3 className="font-bold uppercase bg-gray-100 p-1">BÊN MUA (BÊN B):</h3>
                <p>Ông/Bà: ........................................................................................................</p>
                <p>CMND/CCCD số: ................................. Cấp ngày: .................... Tại: ....................</p>
                <p>Địa chỉ: ........................................................................................................</p>
            </div>

            <div className="mb-4">
                <h3 className="font-bold uppercase bg-gray-100 p-1">ĐIỀU 1: ĐỐI TƯỢNG MUA BÁN</h3>
                <p>Bên A đồng ý bán cho Bên B chiếc xe với đặc điểm sau:</p>
                <table className="w-full border-collapse border border-black mt-2">
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 font-bold">Nhãn hiệu</td>
                            <td className="border border-black p-2">{car.dongXe}</td>
                            <td className="border border-black p-2 font-bold">Biển số</td>
                            <td className="border border-black p-2">{car.bienSo}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-bold">Màu sơn</td>
                            <td className="border border-black p-2">{car.mauXe}</td>
                            <td className="border border-black p-2 font-bold">Năm SX</td>
                            <td className="border border-black p-2">{car.namSanXuat}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-bold">Số khung</td>
                            <td className="border border-black p-2" colSpan={3}>{car.soKhung}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-bold">Số máy</td>
                            <td className="border border-black p-2" colSpan={3}>{car.soMay}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mb-4">
                <h3 className="font-bold uppercase bg-gray-100 p-1">ĐIỀU 2: GIÁ CẢ & PHƯƠNG THỨC THANH TOÁN</h3>
                <p>1. Giá bán hai bên thỏa thuận là: <strong>........................................................ VNĐ</strong></p>
                <p>(Bằng chữ: ........................................................................................................................)</p>
                <p>2. Bên B đã đặt cọc trước: <strong>{formatCurrency(car.soTienCoc)}</strong></p>
                <p>3. Số tiền còn lại phải thanh toán: ........................................................ VNĐ</p>
            </div>

            <div className="mb-4">
                <h3 className="font-bold uppercase bg-gray-100 p-1">ĐIỀU 3: CAM KẾT</h3>
                <p>- Bên A cam kết xe không tranh chấp, không cầm cố, thế chấp, giấy tờ hợp lệ.</p>
                <p>- Bên B đã kiểm tra kỹ tình trạng xe (máy móc, khung gầm...) và đồng ý mua xe với hiện trạng thực tế.</p>
            </div>
        </div>

        <div className="flex justify-between mt-16 text-center">
            <div className="w-1/2">
                <p className="font-bold mb-20">ĐẠI DIỆN BÊN B (MUA)</p>
                <p>(Ký, ghi rõ họ tên)</p>
            </div>
            <div className="w-1/2">
                <p className="font-bold mb-20">ĐẠI DIỆN BÊN A (BÁN)</p>
                <p>Nguyễn Văn A</p>
            </div>
        </div>

      </div>

      <div className="fixed bottom-10 right-10 print:hidden flex gap-4">
          <button className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-lg">
             ✏️ Chỉnh sửa
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-bold hover:bg-blue-700">
             🖨️ In Hợp Đồng (Ctrl + P)
          </button>
      </div>
    </div>
  );
}