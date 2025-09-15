import GlowyCallButton from "@/components/glowy-button";
import { Calendar } from "lucide-react";

export default function GlowyButtonDemo() {
  return (
    <GlowyCallButton key="Glowy Button" href="https://cal.com/sarthakkapila/lets-talk" icon={<Calendar/>}>
      Book a call
    </GlowyCallButton>
  );
}
