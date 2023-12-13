/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.18',
  networks: {
    sepolia: {
      url: 'https://hidden-tame-yard.ethereum-sepolia.discover.quiknode.pro/28f14b3ac8aa67712c4c4a49a26a8b9698b1fe68/',
      accounts: ['df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'],
    },
  },
};
