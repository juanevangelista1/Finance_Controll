'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useCreditCardsContext } from '../../contexts/CreditCardsContext';

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreditCardForm({ open, onOpenChange }: Props) {
	const { createCard } = useCreditCardsContext();
	const [name, setName] = useState('');
	const [limit, setLimit] = useState('');
	const [used, setUsed] = useState('');
	const [status, setStatus] = useState('');

	function handleClose() {
		setName('');
		setLimit('');
		setUsed('');
		setStatus('');
		onOpenChange(false);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		createCard({
			name: name.trim(),
			limit: Number(limit) || 0,
			used: Number(used) || 0,
			status: status.trim() || undefined,
		});
		handleClose();
	}

	return (
		<Dialog.Root open={open} onOpenChange={handleClose}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in' />
				<Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dt-border bg-dt-surface p-6 shadow-2xl animate-slide-up mx-4'>
					<div className='mb-6 flex items-center justify-between'>
						<Dialog.Title className='text-lg font-bold text-white'>Novo Cartão</Dialog.Title>
						<button
							onClick={handleClose}
							className='cursor-pointer rounded-lg p-2 text-dt-muted hover:text-white hover:bg-white/5 transition-colors'>
							<X className='h-4 w-4' />
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='mb-1.5 block text-sm font-medium text-dt-muted'>Nome do cartão</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Ex: Bradesco, Will, PicPay...'
								className='h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all'
							/>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className='mb-1.5 block text-sm font-medium text-dt-muted'>Limite (R$)</label>
								<input
									type='number'
									step='0.01'
									value={limit}
									onChange={(e) => setLimit(e.target.value)}
									placeholder='0,00'
									className='h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all'
								/>
							</div>
							<div>
								<label className='mb-1.5 block text-sm font-medium text-dt-muted'>Usado (R$)</label>
								<input
									type='number'
									step='0.01'
									value={used}
									onChange={(e) => setUsed(e.target.value)}
									placeholder='0,00'
									className='h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all'
								/>
							</div>
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-dt-muted'>Status (opcional)</label>
							<input
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								placeholder='Ex: Aguardando, Em dia...'
								className='h-11 w-full rounded-xl border border-dt-border bg-dt-card px-4 text-sm text-white placeholder:text-dt-muted/60 focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all'
							/>
						</div>

						<button
							type='submit'
							className='mt-2 w-full rounded-xl bg-dt-purple py-3 text-sm font-bold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark active:scale-[0.99]'>
							Adicionar cartão
						</button>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
