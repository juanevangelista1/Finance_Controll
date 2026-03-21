import { Summary } from '../presentation/components/Summary';
import { MonthYearFilter } from '../presentation/components/MonthYearFilter';
import { SearchForm } from '../presentation/components/SearchForm';
import { TransactionsList } from '../presentation/components/TransactionsList';

export default function DashboardPage() {
	return (
		<div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6'>
			{/* Page Title */}
			<div>
				<h1 className='text-2xl font-bold text-white'>Controle Financeiro 🤑</h1>
				<p className='mt-1 text-sm text-dt-muted'>Acompanhe suas finanças do período selecionado</p>
			</div>

			{/* Summary Cards */}
			<Summary />

			{/* Month/Year Filter */}
			<MonthYearFilter />

			{/* Search & Transactions */}
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-base font-semibold text-white'>Transações</h2>
				</div>
				<SearchForm />
				<TransactionsList />
			</div>
		</div>
	);
}
