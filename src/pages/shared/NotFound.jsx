import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const nav = useNavigate();
  return (
    <div className="grid place-items-center py-16">
      <Card className="w-[min(720px,92vw)] p-8 text-center">
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">الصفحة غير موجودة</div>
        <div className="mt-2 text-[13px] text-[var(--zinc-600)]">
          يبدو أن الرابط غير صحيح أو تم نقل الصفحة.
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => nav(-1)}>رجوع</Button>
          <Button variant="secondary" onClick={() => nav("/")}>
            الرئيسية
          </Button>
        </div>
      </Card>
    </div>
  );
}

