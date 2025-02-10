import Header from '@/components/layout/Header';
import React from 'react'

interface Props {
	address?: string;
	children: React.ReactNode; 
}

const Layout: React.FC<Props> = ({ address, children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header address={address} />
			{children}
		</div>
	);
};

export default Layout;

