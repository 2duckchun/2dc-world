import type { Metadata } from "next"
import { PrivacyView } from "@/views/privacy"

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description:
    "2DC Tech Blog의 개인정보 수집·처리·보관·위탁에 대한 처리방침입니다.",
}

export default function PrivacyPage() {
  return <PrivacyView />
}
