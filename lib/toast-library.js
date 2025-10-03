
import { toast } from 'sonner';
export function toastRichSuccess(props) {
    toast.success(props.message, {
        duration: props.duration || 1000,
        position: props.position || 'top-center',
        style: {
            background: 'var(--success-bg)',
            color: 'var(--success-text)',
        },
    });
}
