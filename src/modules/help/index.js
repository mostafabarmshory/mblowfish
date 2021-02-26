import mblowfish from '../../mblowfish';


import helpProvider from './services/mbHelp';

mblowfish
	.provider('$mbHelp', helpProvider);