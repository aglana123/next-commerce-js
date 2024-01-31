'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface ActionsProps {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);
				toast.success('Course unpublished');
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);
				toast.success('Course published');
			}

			router.refresh();
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/courses/${courseId}`);

			toast.success('Course deleted');
			router.refresh();
			router.push(`/teacher/courses`);
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}>
				{isPublished ? 'Unpublish' : 'Publish'}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button
					variant={'destructive'}
					disabled={isLoading}>
					<Trash className="h-4 w-4 mr-2" /> Hapus
				</Button>
			</ConfirmModal>
		</div>
	);
};
