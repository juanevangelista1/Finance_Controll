'use client';

import type { BucketProgress } from '../../hooks/useBudget';
import { formatCurrency } from '../../../shared/utils/formatter';
import { cn } from '../../../shared/utils/cn';

interface Props {
	bucket: BucketProgress;
}

export function BudgetBucketCard({ bucket }: Props) {
	const progressCapped = Math.min(bucket.progress, 1);
	const overBudget = bucket.target > 0 && bucket.spent > bucket.target;
	const noIncome = bucket.target === 0;

	const statusStyles = {
		safe: {
			border: 'border-blue-500/20',
			bar: 'bg-blue-500',
			badge: 'bg-emerald-500/10 text-emerald-400',
			pct: 'text-blue-400',
		},
		warning: {
			border: 'border-yellow-400/30',
			bar: 'bg-yellow-400',
			badge: 'bg-yellow-400/10 text-yellow-400',
			pct: 'text-yellow-400',
		},
		danger: {
			border: 'border-dt-red/40',
			bar: 'bg-dt-red',
			badge: 'bg-dt-red/10 text-dt-red',
			pct: 'text-dt-red',
		},
	}[bucket.status];

	return (
		<div className={cn('rounded-xl border bg-dt-card p-5 flex flex-col gap-4', statusStyles.border)}>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div className='flex items-center gap-3'>
					<span className='text-2xl'>{bucket.icon}</span>
					<div>
						<h3 className='text-sm font-semibold text-white'>{bucket.label}</h3>
						<p className='text-xs text-dt-muted'>{bucket.percentage}% da renda mensal</p>
					</div>
				</div>
				<div className='text-right'>
					<p className={cn('text-lg font-bold', statusStyles.pct)}>
						{noIncome ? '—' : `${Math.round(bucket.progress * 100)}%`}
					</p>
					<p className='text-xs text-dt-muted'>utilizado</p>
				</div>
			</div>

			{/* Progress Bar */}
			<div className='space-y-1.5'>
				<div className='h-2.5 w-full rounded-full bg-dt-border overflow-hidden'>
					<div
						className={cn('h-full rounded-full transition-all duration-700', statusStyles.bar)}
						style={{ width: `${progressCapped * 100}%` }}
					/>
				</div>
				<div className='flex justify-between text-xs text-dt-muted'>
					<span>{formatCurrency(bucket.spent)} gastos</span>
					<span>limite {formatCurrency(bucket.target)}</span>
				</div>
			</div>

			{/* Status Badge */}
			{!noIncome && (
				<div className={cn('rounded-lg px-3 py-2 text-xs font-medium', statusStyles.badge)}>
					{overBudget
						? `⚠️ ${formatCurrency(bucket.spent - bucket.target)} acima do limite`
						: bucket.status === 'warning'
							? `⚡ Atenção — ${formatCurrency(bucket.remaining)} restantes`
							: `✓ ${formatCurrency(bucket.remaining)} disponível`}
				</div>
			)}

			{noIncome && (
				<div className='rounded-lg px-3 py-2 text-xs font-medium bg-dt-border/40 text-dt-muted'>
					Registre entradas para calcular o limite
				</div>
			)}

			{/* Top Categories */}
			{bucket.topCategories.length > 0 && (
				<div className='space-y-2 pt-1 border-t border-dt-border'>
					<p className='text-xs font-medium text-dt-muted uppercase tracking-wider'>Maiores gastos</p>
					{bucket.topCategories.map((cat) => {
						const pct = bucket.spent > 0 ? (cat.amount / bucket.spent) * 100 : 0;
						return (
							<div
								key={cat.category}
								className='flex items-center justify-between text-xs gap-3'>
								<span className='text-dt-muted truncate'>{cat.label}</span>
								<div className='flex items-center gap-2 shrink-0'>
									<span className='text-dt-muted'>{Math.round(pct)}%</span>
									<span className='text-white font-semibold'>{formatCurrency(cat.amount)}</span>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{bucket.topCategories.length === 0 && !noIncome && (
				<p className='text-xs text-dt-muted text-center pt-1 border-t border-dt-border'>
					Nenhum gasto nesta categoria ainda
				</p>
			)}
		</div>
	);
}
