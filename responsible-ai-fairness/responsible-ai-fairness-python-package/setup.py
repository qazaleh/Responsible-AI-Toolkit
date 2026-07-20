import setuptools
setuptools.setup(
                 name='TrustAI_responsible_ai_fairness',
                 version='1.1.5',
                 description='Responsible AI',
                 long_description='TrustAI_responsible_ai_fairness',
                 classifiers=['Programming Language :: Python :: 3', 'License :: OSI Approved :: MIT License', 'Operating System :: OS Independent'],
                 package_dir={'': 'TrustAI_responsible_ai_fairness'},
                 packages=setuptools.find_packages(where='TrustAI_responsible_ai_fairness'),
                 python_requires='>=3.6',
                 install_requires=['pandas', 'numpy', 'aif360'])