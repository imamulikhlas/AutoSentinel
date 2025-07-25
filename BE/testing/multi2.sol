// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// From: lib/chainlink-evm/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol
// solhint-disable-next-line interface-starts-with-i
interface AggregatorV3Interface {
function decimals() external view returns (uint8);
function description() external view returns (string memory);
function version() external view returns (uint256);
function getRoundData(
uint80 _roundId
) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
function latestRoundData()
external
view
returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

// From: lib/openzeppelin-contracts/contracts/interfaces/IERC165.sol
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC165.sol)

// From: lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol
// OpenZeppelin Contracts (last updated v5.1.0) (utils/introspection/IERC165.sol)
/**
* @dev Interface of the ERC-165 standard, as defined in the
* https://eips.ethereum.org/EIPS/eip-165[ERC].
*
* Implementers can declare support of contract interfaces, which can then be
* queried by others ({ERC165Checker}).
*
* For an implementation, see {ERC165}.
*/
interface IERC165 {
/**
* @dev Returns true if this contract implements the interface defined by
* `interfaceId`. See the corresponding
* https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
* to learn more about how these ids are created.
*
* This function call must use less than 30 000 gas.
*/
function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// From: lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)
/**
* @dev Interface of the ERC-20 standard as defined in the ERC.
*/
interface IERC20 {
/**
* @dev Emitted when `value` tokens are moved from one account (`from`) to
* another (`to`).
*
* Note that `value` may be zero.
*/
event Transfer(address indexed from, address indexed to, uint256 value);
/**
* @dev Emitted when the allowance of a `spender` for an `owner` is set by
* a call to {approve}. `value` is the new allowance.
*/
event Approval(address indexed owner, address indexed spender, uint256 value);
/**
* @dev Returns the value of tokens in existence.
*/
function totalSupply() external view returns (uint256);
/**
* @dev Returns the value of tokens owned by `account`.
*/
function balanceOf(address account) external view returns (uint256);
/**
* @dev Moves a `value` amount of tokens from the caller's account to `to`.
*
* Returns a boolean value indicating whether the operation succeeded.
*
* Emits a {Transfer} event.
*/
function transfer(address to, uint256 value) external returns (bool);
/**
* @dev Returns the remaining number of tokens that `spender` will be
* allowed to spend on behalf of `owner` through {transferFrom}. This is
* zero by default.
*
* This value changes when {approve} or {transferFrom} are called.
*/
function allowance(address owner, address spender) external view returns (uint256);
/**
* @dev Sets a `value` amount of tokens as the allowance of `spender` over the
* caller's tokens.
*
* Returns a boolean value indicating whether the operation succeeded.
*
* IMPORTANT: Beware that changing an allowance with this method brings the risk
* that someone may use both the old and the new allowance by unfortunate
* transaction ordering. One possible solution to mitigate this race
* condition is to first reduce the spender's allowance to 0 and set the
* desired value afterwards:
* https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
*
* Emits an {Approval} event.
*/
function approve(address spender, uint256 value) external returns (bool);
/**
* @dev Moves a `value` amount of tokens from `from` to `to` using the
* allowance mechanism. `value` is then deducted from the caller's
* allowance.
*
* Returns a boolean value indicating whether the operation succeeded.
*
* Emits a {Transfer} event.
*/
function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// From: lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC20.sol)

// From: lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/IERC20Metadata.sol)
/**
* @dev Interface for the optional metadata functions from the ERC-20 standard.
*/
interface IERC20Metadata is IERC20 {
/**
* @dev Returns the name of the token.
*/
function name() external view returns (string memory);
/**
* @dev Returns the symbol of the token.
*/
function symbol() external view returns (string memory);
/**
* @dev Returns the decimals places of the token.
*/
function decimals() external view returns (uint8);
}

// From: lib/openzeppelin-contracts/contracts/interfaces/IERC1363.sol
// OpenZeppelin Contracts (last updated v5.1.0) (interfaces/IERC1363.sol)
/**
* @title IERC1363
* @dev Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
*
* Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
* after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
*/
interface IERC1363 is IERC20, IERC165 {
/*
* Note: the ERC-165 identifier for this interface is 0xb0202a11.
* 0xb0202a11 ===
*   bytes4(keccak256('transferAndCall(address,uint256)')) ^
*   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
*   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
*   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)')) ^
*   bytes4(keccak256('approveAndCall(address,uint256)')) ^
*   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
*/
/**
* @dev Moves a `value` amount of tokens from the caller's account to `to`
* and then calls {IERC1363Receiver-onTransferReceived} on `to`.
* @param to The address which you want to transfer to.
* @param value The amount of tokens to be transferred.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function transferAndCall(address to, uint256 value) external returns (bool);
/**
* @dev Moves a `value` amount of tokens from the caller's account to `to`
* and then calls {IERC1363Receiver-onTransferReceived} on `to`.
* @param to The address which you want to transfer to.
* @param value The amount of tokens to be transferred.
* @param data Additional data with no specified format, sent in call to `to`.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);
/**
* @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
* and then calls {IERC1363Receiver-onTransferReceived} on `to`.
* @param from The address which you want to send tokens from.
* @param to The address which you want to transfer to.
* @param value The amount of tokens to be transferred.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function transferFromAndCall(address from, address to, uint256 value) external returns (bool);
/**
* @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
* and then calls {IERC1363Receiver-onTransferReceived} on `to`.
* @param from The address which you want to send tokens from.
* @param to The address which you want to transfer to.
* @param value The amount of tokens to be transferred.
* @param data Additional data with no specified format, sent in call to `to`.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);
/**
* @dev Sets a `value` amount of tokens as the allowance of `spender` over the
* caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
* @param spender The address which will spend the funds.
* @param value The amount of tokens to be spent.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function approveAndCall(address spender, uint256 value) external returns (bool);
/**
* @dev Sets a `value` amount of tokens as the allowance of `spender` over the
* caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
* @param spender The address which will spend the funds.
* @param value The amount of tokens to be spent.
* @param data Additional data with no specified format, sent in call to `spender`.
* @return A boolean value indicating whether the operation succeeded unless throwing.
*/
function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}

// From: contracts/interfaces/ILaunchpadToken.sol
interface ILaunchpadToken {
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
// -----------------------------------------
// Events
// -----------------------------------------
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
/**
* @dev Returns the address of the contract deployer
*/
function deployer() external view returns (address);
/**
* @dev Returns true if the token is explicitely allowed for Genie Launchpads
*/
function isLaunchpadToken() external view returns (bool);
// -----------------------------------------
// Public functions
// -----------------------------------------
// -----------------------------------------
// Internal functions
// -----------------------------------------
// -----------------------------------------
// Private functions
// -----------------------------------------
}

// From: lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol
// OpenZeppelin Contracts (last updated v5.3.0) (proxy/utils/Initializable.sol)
/**
* @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
* behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
* external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
* function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
*
* The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
* reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
* case an upgrade adds a module that needs to be initialized.
*
* For example:
*
* [.hljs-theme-light.nopadding]
* ```solidity
* contract MyToken is ERC20Upgradeable {
*     function initialize() initializer public {
*         __ERC20_init("MyToken", "MTK");
*     }
* }
*
* contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
*     function initializeV2() reinitializer(2) public {
*         __ERC20Permit_init("MyToken");
*     }
* }
* ```
*
* TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
* possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
*
* CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
* that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
*
* [CAUTION]
* ====
* Avoid leaving a contract uninitialized.
*
* An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
* contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
* the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
*
* [.hljs-theme-light.nopadding]
* ```
* /// @custom:oz-upgrades-unsafe-allow constructor
* constructor() {
*     _disableInitializers();
* }
* ```
* ====
*/
abstract contract Initializable {
/**
* @dev Storage of the initializable contract.
*
* It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
* when using with upgradeable contracts.
*
* @custom:storage-location erc7201:openzeppelin.storage.Initializable
*/
struct InitializableStorage {
/**
* @dev Indicates that the contract has been initialized.
*/
uint64 _initialized;
/**
* @dev Indicates that the contract is in the process of being initialized.
*/
bool _initializing;
}
// keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;
/**
* @dev The contract is already initialized.
*/
error InvalidInitialization();
/**
* @dev The contract is not initializing.
*/
error NotInitializing();
/**
* @dev Triggered when the contract has been initialized or reinitialized.
*/
event Initialized(uint64 version);
/**
* @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
* `onlyInitializing` functions can be used to initialize parent contracts.
*
* Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
* number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
* production.
*
* Emits an {Initialized} event.
*/
modifier initializer() {
// solhint-disable-next-line var-name-mixedcase
InitializableStorage storage $ = _getInitializableStorage();
// Cache values to avoid duplicated sloads
bool isTopLevelCall = !$._initializing;
uint64 initialized = $._initialized;
// Allowed calls:
// - initialSetup: the contract is not in the initializing state and no previous version was
//                 initialized
// - construction: the contract is initialized at version 1 (no reinitialization) and the
//                 current contract is just being deployed
bool initialSetup = initialized == 0 && isTopLevelCall;
bool construction = initialized == 1 && address(this).code.length == 0;
if (!initialSetup && !construction) {
revert InvalidInitialization();
}
$._initialized = 1;
if (isTopLevelCall) {
$._initializing = true;
}
_;
if (isTopLevelCall) {
$._initializing = false;
emit Initialized(1);
}
}
/**
* @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
* contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
* used to initialize parent contracts.
*
* A reinitializer may be used after the original initialization step. This is essential to configure modules that
* are added through upgrades and that require initialization.
*
* When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
* cannot be nested. If one is invoked in the context of another, execution will revert.
*
* Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
* a contract, executing them in the right order is up to the developer or operator.
*
* WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
*
* Emits an {Initialized} event.
*/
modifier reinitializer(uint64 version) {
// solhint-disable-next-line var-name-mixedcase
InitializableStorage storage $ = _getInitializableStorage();
if ($._initializing || $._initialized >= version) {
revert InvalidInitialization();
}
$._initialized = version;
$._initializing = true;
_;
$._initializing = false;
emit Initialized(version);
}
/**
* @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
* {initializer} and {reinitializer} modifiers, directly or indirectly.
*/
modifier onlyInitializing() {
_checkInitializing();
_;
}
/**
* @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
*/
function _checkInitializing() internal view virtual {
if (!_isInitializing()) {
revert NotInitializing();
}
}
/**
* @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
* Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
* to any version. It is recommended to use this to lock implementation contracts that are designed to be called
* through proxies.
*
* Emits an {Initialized} event the first time it is successfully executed.
*/
function _disableInitializers() internal virtual {
// solhint-disable-next-line var-name-mixedcase
InitializableStorage storage $ = _getInitializableStorage();
if ($._initializing) {
revert InvalidInitialization();
}
if ($._initialized != type(uint64).max) {
$._initialized = type(uint64).max;
emit Initialized(type(uint64).max);
}
}
/**
* @dev Returns the highest version that has been initialized. See {reinitializer}.
*/
function _getInitializedVersion() internal view returns (uint64) {
return _getInitializableStorage()._initialized;
}
/**
* @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
*/
function _isInitializing() internal view returns (bool) {
return _getInitializableStorage()._initializing;
}
/**
* @dev Pointer to storage slot. Allows integrators to override it with a custom storage location.
*
* NOTE: Consider following the ERC-7201 formula to derive storage locations.
*/
function _initializableStorageSlot() internal pure virtual returns (bytes32) {
return INITIALIZABLE_STORAGE;
}
/**
* @dev Returns a pointer to the storage namespace.
*/
// solhint-disable-next-line var-name-mixedcase
function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
bytes32 slot = _initializableStorageSlot();
assembly {
$.slot := slot
}
}
}

// From: contracts/lib/Error.sol
interface Error {
// -----------------------------------------
// Type declarations
// -----------------------------------------
// Minting Errors
error MintingNotAllowedForAddress();
// Launchpad
error InvalidTimestamp();
error InvalidShareRate();
error TokenNotAcceptedForLaunchpad();
error UnknownPaymentToken();
error PaymentTokenAllowanceTooLow();
error LaunchpadTokenAllowanceTooLow();
error IntendedEthAmountMissmatch();
error LaunchpadTokenBalanceTooLow();
error PaymentTokenBalanceTooLow();
// Price
error PriceFeedTimedOut();
error PriceFeedInvalidResponse();
// Qoutes
error InvalidPaymentTokenAmount();
// Parameters
error LaunchpadNotActive();
error LaunchpadHasEnded();
error LaunchpadIsActive();
error InvalidTokenExchangeRate();
error InvalidAddress();
error OutOfBoundary();
error HasDuplicatedValues();
error InitialCommissionModeMustNotBeNone();
error TotalPartnerSharesExceeded();
// MLM Errors
error MlmDisabled();
error MlmUserDoesNotExist();
error MlmUserIsPartner();
error MlmWrongParam();
error MlmIsDesignatedAddress();
error MlmCannotChangeReferrer();
error MlmNewCommissionModeMustNotBeNone();
error MlmMaxTreeDepth();
// Escrow
error NothingToRelease();
error FatalEscrowError();
error InvalidRefferId();
// -----------------------------------------
// State variables
// -----------------------------------------
// -----------------------------------------
// Events
// -----------------------------------------
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
// -----------------------------------------
// Public functions
// -----------------------------------------
// -----------------------------------------
// Internal functions
// -----------------------------------------
// -----------------------------------------
// Private functions
// -----------------------------------------
}

// From: lib/openzeppelin-contracts-upgradeable/contracts/utils/ContextUpgradeable.sol
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)
/**
* @dev Provides information about the current execution context, including the
* sender of the transaction and its data. While these are generally available
* via msg.sender and msg.data, they should not be accessed in such a direct
* manner, since when dealing with meta-transactions the account sending and
* paying for execution may not be the actual sender (as far as an application
* is concerned).
*
* This contract is only required for intermediate, library-like contracts.
*/
abstract contract ContextUpgradeable is Initializable {
function __Context_init() internal onlyInitializing {
}
function __Context_init_unchained() internal onlyInitializing {
}
function _msgSender() internal view virtual returns (address) {
return msg.sender;
}
function _msgData() internal view virtual returns (bytes calldata) {
return msg.data;
}
function _contextSuffixLength() internal view virtual returns (uint256) {
return 0;
}
}

// From: lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)
/**
* @dev Contract module which provides a basic access control mechanism, where
* there is an account (an owner) that can be granted exclusive access to
* specific functions.
*
* The initial owner is set to the address provided by the deployer. This can
* later be changed with {transferOwnership}.
*
* This module is used through inheritance. It will make available the modifier
* `onlyOwner`, which can be applied to your functions to restrict their use to
* the owner.
*/
abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
/// @custom:storage-location erc7201:openzeppelin.storage.Ownable
struct OwnableStorage {
address _owner;
}
// keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Ownable")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant OwnableStorageLocation = 0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300;
function _getOwnableStorage() private pure returns (OwnableStorage storage $) {
assembly {
$.slot := OwnableStorageLocation
}
}
/**
* @dev The caller account is not authorized to perform an operation.
*/
error OwnableUnauthorizedAccount(address account);
/**
* @dev The owner is not a valid owner account. (eg. `address(0)`)
*/
error OwnableInvalidOwner(address owner);
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
/**
* @dev Initializes the contract setting the address provided by the deployer as the initial owner.
*/
function __Ownable_init(address initialOwner) internal onlyInitializing {
__Ownable_init_unchained(initialOwner);
}
function __Ownable_init_unchained(address initialOwner) internal onlyInitializing {
if (initialOwner == address(0)) {
revert OwnableInvalidOwner(address(0));
}
_transferOwnership(initialOwner);
}
/**
* @dev Throws if called by any account other than the owner.
*/
modifier onlyOwner() {
_checkOwner();
_;
}
/**
* @dev Returns the address of the current owner.
*/
function owner() public view virtual returns (address) {
OwnableStorage storage $ = _getOwnableStorage();
return $._owner;
}
/**
* @dev Throws if the sender is not the owner.
*/
function _checkOwner() internal view virtual {
if (owner() != _msgSender()) {
revert OwnableUnauthorizedAccount(_msgSender());
}
}
/**
* @dev Leaves the contract without owner. It will not be possible to call
* `onlyOwner` functions. Can only be called by the current owner.
*
* NOTE: Renouncing ownership will leave the contract without an owner,
* thereby disabling any functionality that is only available to the owner.
*/
function renounceOwnership() public virtual onlyOwner {
_transferOwnership(address(0));
}
/**
* @dev Transfers ownership of the contract to a new account (`newOwner`).
* Can only be called by the current owner.
*/
function transferOwnership(address newOwner) public virtual onlyOwner {
if (newOwner == address(0)) {
revert OwnableInvalidOwner(address(0));
}
_transferOwnership(newOwner);
}
/**
* @dev Transfers ownership of the contract to a new account (`newOwner`).
* Internal function without access restriction.
*/
function _transferOwnership(address newOwner) internal virtual {
OwnableStorage storage $ = _getOwnableStorage();
address oldOwner = $._owner;
$._owner = newOwner;
emit OwnershipTransferred(oldOwner, newOwner);
}
}

// From: lib/openzeppelin-contracts-upgradeable/contracts/utils/ReentrancyGuardUpgradeable.sol
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)
/**
* @dev Contract module that helps prevent reentrant calls to a function.
*
* Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
* available, which can be applied to functions to make sure there are no nested
* (reentrant) calls to them.
*
* Note that because there is a single `nonReentrant` guard, functions marked as
* `nonReentrant` may not call one another. This can be worked around by making
* those functions `private`, and then adding `external` `nonReentrant` entry
* points to them.
*
* TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
* consider using {ReentrancyGuardTransient} instead.
*
* TIP: If you would like to learn more about reentrancy and alternative ways
* to protect against it, check out our blog post
* https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
*/
abstract contract ReentrancyGuardUpgradeable is Initializable {
// Booleans are more expensive than uint256 or any type that takes up a full
// word because each write operation emits an extra SLOAD to first read the
// slot's contents, replace the bits taken up by the boolean, and then write
// back. This is the compiler's defense against contract upgrades and
// pointer aliasing, and it cannot be disabled.
// The values being non-zero value makes deployment a bit more expensive,
// but in exchange the refund on every call to nonReentrant will be lower in
// amount. Since refunds are capped to a percentage of the total
// transaction's gas, it is best to keep them low in cases like this one, to
// increase the likelihood of the full refund coming into effect.
uint256 private constant NOT_ENTERED = 1;
uint256 private constant ENTERED = 2;
/// @custom:storage-location erc7201:openzeppelin.storage.ReentrancyGuard
struct ReentrancyGuardStorage {
uint256 _status;
}
// keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant ReentrancyGuardStorageLocation = 0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;
function _getReentrancyGuardStorage() private pure returns (ReentrancyGuardStorage storage $) {
assembly {
$.slot := ReentrancyGuardStorageLocation
}
}
/**
* @dev Unauthorized reentrant call.
*/
error ReentrancyGuardReentrantCall();
function __ReentrancyGuard_init() internal onlyInitializing {
__ReentrancyGuard_init_unchained();
}
function __ReentrancyGuard_init_unchained() internal onlyInitializing {
ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
$._status = NOT_ENTERED;
}
/**
* @dev Prevents a contract from calling itself, directly or indirectly.
* Calling a `nonReentrant` function from another `nonReentrant`
* function is not supported. It is possible to prevent this from happening
* by making the `nonReentrant` function external, and making it call a
* `private` function that does the actual work.
*/
modifier nonReentrant() {
_nonReentrantBefore();
_;
_nonReentrantAfter();
}
function _nonReentrantBefore() private {
ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
// On the first call to nonReentrant, _status will be NOT_ENTERED
if ($._status == ENTERED) {
revert ReentrancyGuardReentrantCall();
}
// Any calls to nonReentrant after this point will fail
$._status = ENTERED;
}
function _nonReentrantAfter() private {
ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
// By storing the original value once again, a refund is triggered (see
// https://eips.ethereum.org/EIPS/eip-2200)
$._status = NOT_ENTERED;
}
/**
* @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
* `nonReentrant` function in the call stack.
*/
function _reentrancyGuardEntered() internal view returns (bool) {
ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
return $._status == ENTERED;
}
}

// From: lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol
// OpenZeppelin Contracts (last updated v5.3.0) (token/ERC20/utils/SafeERC20.sol)
/**
* @title SafeERC20
* @dev Wrappers around ERC-20 operations that throw on failure (when the token
* contract returns false). Tokens that return no value (and instead revert or
* throw on failure) are also supported, non-reverting calls are assumed to be
* successful.
* To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
* which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
*/
library SafeERC20 {
/**
* @dev An operation with an ERC-20 token failed.
*/
error SafeERC20FailedOperation(address token);
/**
* @dev Indicates a failed `decreaseAllowance` request.
*/
error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);
/**
* @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
* non-reverting calls are assumed to be successful.
*/
function safeTransfer(IERC20 token, address to, uint256 value) internal {
_callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
}
/**
* @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
* calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
*/
function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
_callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
}
/**
* @dev Variant of {safeTransfer} that returns a bool instead of reverting if the operation is not successful.
*/
function trySafeTransfer(IERC20 token, address to, uint256 value) internal returns (bool) {
return _callOptionalReturnBool(token, abi.encodeCall(token.transfer, (to, value)));
}
/**
* @dev Variant of {safeTransferFrom} that returns a bool instead of reverting if the operation is not successful.
*/
function trySafeTransferFrom(IERC20 token, address from, address to, uint256 value) internal returns (bool) {
return _callOptionalReturnBool(token, abi.encodeCall(token.transferFrom, (from, to, value)));
}
/**
* @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
* non-reverting calls are assumed to be successful.
*
* IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
* smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
* this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
* that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
*/
function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
uint256 oldAllowance = token.allowance(address(this), spender);
forceApprove(token, spender, oldAllowance + value);
}
/**
* @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
* value, non-reverting calls are assumed to be successful.
*
* IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
* smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
* this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
* that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
*/
function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
unchecked {
uint256 currentAllowance = token.allowance(address(this), spender);
if (currentAllowance < requestedDecrease) {
revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
}
forceApprove(token, spender, currentAllowance - requestedDecrease);
}
}
/**
* @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
* non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
* to be set to zero before setting it to a non-zero value, such as USDT.
*
* NOTE: If the token implements ERC-7674, this function will not modify any temporary allowance. This function
* only sets the "standard" allowance. Any temporary allowance will remain active, in addition to the value being
* set here.
*/
function forceApprove(IERC20 token, address spender, uint256 value) internal {
bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));
if (!_callOptionalReturnBool(token, approvalCall)) {
_callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
_callOptionalReturn(token, approvalCall);
}
}
/**
* @dev Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
* code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
* targeting contracts.
*
* Reverts if the returned value is other than `true`.
*/
function transferAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
if (to.code.length == 0) {
safeTransfer(token, to, value);
} else if (!token.transferAndCall(to, value, data)) {
revert SafeERC20FailedOperation(address(token));
}
}
/**
* @dev Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
* has no code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
* targeting contracts.
*
* Reverts if the returned value is other than `true`.
*/
function transferFromAndCallRelaxed(
IERC1363 token,
address from,
address to,
uint256 value,
bytes memory data
) internal {
if (to.code.length == 0) {
safeTransferFrom(token, from, to, value);
} else if (!token.transferFromAndCall(from, to, value, data)) {
revert SafeERC20FailedOperation(address(token));
}
}
/**
* @dev Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
* code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
* targeting contracts.
*
* NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
* Opposedly, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
* once without retrying, and relies on the returned value to be true.
*
* Reverts if the returned value is other than `true`.
*/
function approveAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
if (to.code.length == 0) {
forceApprove(token, to, value);
} else if (!token.approveAndCall(to, value, data)) {
revert SafeERC20FailedOperation(address(token));
}
}
/**
* @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
* on the return value: the return value is optional (but if data is returned, it must not be false).
* @param token The token targeted by the call.
* @param data The call data (encoded using abi.encode or one of its variants).
*
* This is a variant of {_callOptionalReturnBool} that reverts if call fails to meet the requirements.
*/
function _callOptionalReturn(IERC20 token, bytes memory data) private {
uint256 returnSize;
uint256 returnValue;
assembly ("memory-safe") {
let success := call(gas(), token, 0, add(data, 0x20), mload(data), 0, 0x20)
// bubble errors
if iszero(success) {
let ptr := mload(0x40)
returndatacopy(ptr, 0, returndatasize())
revert(ptr, returndatasize())
}
returnSize := returndatasize()
returnValue := mload(0)
}
if (returnSize == 0 ? address(token).code.length == 0 : returnValue != 1) {
revert SafeERC20FailedOperation(address(token));
}
}
/**
* @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
* on the return value: the return value is optional (but if data is returned, it must not be false).
* @param token The token targeted by the call.
* @param data The call data (encoded using abi.encode or one of its variants).
*
* This is a variant of {_callOptionalReturn} that silently catches all reverts and returns a bool instead.
*/
function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
bool success;
uint256 returnSize;
uint256 returnValue;
assembly ("memory-safe") {
success := call(gas(), token, 0, add(data, 0x20), mload(data), 0, 0x20)
returnSize := returndatasize()
returnValue := mload(0)
}
return success && (returnSize == 0 ? address(token).code.length > 0 : returnValue == 1);
}
}

// From: contracts/lib/Types.sol
library Types {
// -----------------------------------------
// Type declarations
// -----------------------------------------
/// @notice Represents a multi-level-marketing User
struct MlmUser {
/// @notice referrral, address(0) if root
address referrer;
/// @notice the unique referral ID for this user
string userReferralID;
}
/// @notice Commission Payout Modes for Partners and MLM
enum CommissionMode {
/// @notice distribute payment tokens
PaymentToken,
/// @notice distribute launchpad tokens
LaunchpadToken,
/// @notice if both, payment token and launchpad token get distributed
Both,
/// @notice represents the "uninitialized" or "unset" state
None
}
/// @notice Represents a commission
struct Commission {
/// @notice benficiary, will get this distribution
address beneficiary;
/// @notice the token in which the commission is payed, address(0) for native (ETH, BNB)
address tokenAddress;
/// @notice the amount rewarded
uint256 amount;
}
/// @notice Represents a partner configuration within a system.
struct PartnerConfig {
/// @notice The payout address of the partner.
address partner;
/// @notice The share of the partner expressed in basis points (hundredths of a percent).
uint256 share;
/// @notice The partner comission mode
CommissionMode commissionMode;
}
/// @notice Represents a designated address configuration within a system.
struct DesignatedAddressConfig {
/// @notice The payout address of the designated address.
address da;
/// @notice The share of the designated address expressed in basis points (hundredths of a percent).
uint256 share;
}
/// @notice Represents the price feed configuration for a particular token.
struct PriceFeedConfig {
/// @notice The address of the token.
address token;
/// @notice The address of the price feed for the token.
address feed;
}
/// @notice Represents the configuration for a token launchpad.
struct LaunchpadConfig {
/// @notice The address of the launchpad token.
address launchpadToken;
/// @notice The exchange rate for converting dollar to launchpad tokens.
uint256 tokenExchangeRate;
/// @notice The UTC timestamp marking the beginning of the launchpad event.
uint256 start;
/// @notice The UTC timestamp marking the end of the launchpad event.
uint256 end;
/// @notice An array of launchpad partners.
PartnerConfig[] partners;
/// @notice An array of addresses of tokens accepted for payments.
address[] paymentTokens;
/// @notice The maximum total shares for partners, in basis points
uint256 maxTotalSharePartners;
/// @notice The maximum total shares for multi-level-marketing levels, in basis points
uint256 maxTotalShareMlmLevels;
/// @notice The maximum total shares for designated addresses, in basis points
uint256 maxTotalShareDesignatedAddress;
/// @notice The multi-level-marketing levels (rates per level in basis points, [level0, level1 ...])
/// where level0 is the first referrer, level1 is the second referrer...
uint256[] mlmLevels;
/// @notice The comission payout mode for MLM
CommissionMode mlmCommissionMode;
}
// -----------------------------------------
// State variables
// -----------------------------------------
uint8 constant DA_COMMISSION_LEVEL = type(uint8).max;
uint8 constant PARTNER_COMMISSION_LEVEL = type(uint8).max - 1;
uint8 constant OWNER_COMMISSION_LEVEL = type(uint8).max - 2;
// -----------------------------------------
// Events
// -----------------------------------------
/**
* Commission Event
* @param beneficiary beneficiary of this commission
* @param paymentTokenAddress the payment token address
* @param user the user who caused the commission payment
* @param level either the MLM level or special identifier (DA, partner)
* @param amount the commission amount
*/
event CommissionPaid(
address indexed beneficiary,
address indexed paymentTokenAddress,
address indexed user,
uint8 level,
uint256 amount
);
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
// -----------------------------------------
// Public functions
// -----------------------------------------
// -----------------------------------------
// Internal functions
// -----------------------------------------
// -----------------------------------------
// Private functions
// -----------------------------------------
}

// From: contracts/lib/Utility.sol
library Utility {
bytes16 private constant HEX_DIGITS = "0123456789abcdef";
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
// -----------------------------------------
// Events
// -----------------------------------------
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
// -----------------------------------------
// Public functions
// -----------------------------------------
// -----------------------------------------
// Internal functions
// -----------------------------------------
function getStringLength(string memory str) internal pure returns (uint256) {
bytes memory strBytes = bytes(str);
return strBytes.length;
}
/**
* @dev Converts a bytes32 value to its hex string representation
* @param value bytes32 value to convert
* @return string containing the hex representation of the input value
*/
function toHexString(bytes32 value) internal pure returns (string memory) {
bytes memory str = new bytes(64);
for (uint256 i = 0; i < 32; i++) {
str[i * 2] = HEX_DIGITS[uint8(value[i] >> 4)];
str[1 + i * 2] = HEX_DIGITS[uint8(value[i] & 0x0f)];
}
return string(str);
}
// -----------------------------------------
// Private functions
// -----------------------------------------
}

// From: lib/openzeppelin-contracts/contracts/utils/Address.sol
// OpenZeppelin Contracts (last updated v5.2.0) (utils/Address.sol)
/**
* @dev Collection of functions related to the address type
*/
library Address {
/**
* @dev There's no code at `target` (it is not a contract).
*/
error AddressEmptyCode(address target);
/**
* @dev Replacement for Solidity's `transfer`: sends `amount` wei to
* `recipient`, forwarding all available gas and reverting on errors.
*
* https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
* of certain opcodes, possibly making contracts go over the 2300 gas limit
* imposed by `transfer`, making them unable to receive funds via
* `transfer`. {sendValue} removes this limitation.
*
* https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
*
* IMPORTANT: because control is transferred to `recipient`, care must be
* taken to not create reentrancy vulnerabilities. Consider using
* {ReentrancyGuard} or the
* https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
*/
function sendValue(address payable recipient, uint256 amount) internal {
if (address(this).balance < amount) {
revert Errors.InsufficientBalance(address(this).balance, amount);
}
(bool success, bytes memory returndata) = recipient.call{value: amount}("");
if (!success) {
_revert(returndata);
}
}
/**
* @dev Performs a Solidity function call using a low level `call`. A
* plain `call` is an unsafe replacement for a function call: use this
* function instead.
*
* If `target` reverts with a revert reason or custom error, it is bubbled
* up by this function (like regular Solidity function calls). However, if
* the call reverted with no returned reason, this function reverts with a
* {Errors.FailedCall} error.
*
* Returns the raw returned data. To convert to the expected return value,
* use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
*
* Requirements:
*
* - `target` must be a contract.
* - calling `target` with `data` must not revert.
*/
function functionCall(address target, bytes memory data) internal returns (bytes memory) {
return functionCallWithValue(target, data, 0);
}
/**
* @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
* but also transferring `value` wei to `target`.
*
* Requirements:
*
* - the calling contract must have an ETH balance of at least `value`.
* - the called Solidity function must be `payable`.
*/
function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
if (address(this).balance < value) {
revert Errors.InsufficientBalance(address(this).balance, value);
}
(bool success, bytes memory returndata) = target.call{value: value}(data);
return verifyCallResultFromTarget(target, success, returndata);
}
/**
* @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
* but performing a static call.
*/
function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
(bool success, bytes memory returndata) = target.staticcall(data);
return verifyCallResultFromTarget(target, success, returndata);
}
/**
* @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
* but performing a delegate call.
*/
function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
(bool success, bytes memory returndata) = target.delegatecall(data);
return verifyCallResultFromTarget(target, success, returndata);
}
/**
* @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
* was not a contract or bubbling up the revert reason (falling back to {Errors.FailedCall}) in case
* of an unsuccessful call.
*/
function verifyCallResultFromTarget(
address target,
bool success,
bytes memory returndata
) internal view returns (bytes memory) {
if (!success) {
_revert(returndata);
} else {
// only check if target is a contract if the call was successful and the return data is empty
// otherwise we already know that it was a contract
if (returndata.length == 0 && target.code.length == 0) {
revert AddressEmptyCode(target);
}
return returndata;
}
}
/**
* @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
* revert reason or with a default {Errors.FailedCall} error.
*/
function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
if (!success) {
_revert(returndata);
} else {
return returndata;
}
}
/**
* @dev Reverts with returndata if present. Otherwise reverts with {Errors.FailedCall}.
*/
function _revert(bytes memory returndata) private pure {
// Look for revert reason and bubble it up if present
if (returndata.length > 0) {
// The easiest way to bubble the revert reason is using memory via assembly
assembly ("memory-safe") {
let returndata_size := mload(returndata)
revert(add(32, returndata), returndata_size)
}
} else {
revert Errors.FailedCall();
}
}
}

// From: lib/openzeppelin-contracts/contracts/utils/Errors.sol
// OpenZeppelin Contracts (last updated v5.1.0) (utils/Errors.sol)
/**
* @dev Collection of common custom errors used in multiple contracts
*
* IMPORTANT: Backwards compatibility is not guaranteed in future versions of the library.
* It is recommended to avoid relying on the error API for critical functionality.
*
* _Available since v5.1._
*/
library Errors {
/**
* @dev The ETH balance of the account is not enough to perform the operation.
*/
error InsufficientBalance(uint256 balance, uint256 needed);
/**
* @dev A call to an address target failed. The target may have reverted.
*/
error FailedCall();
/**
* @dev The deployment failed.
*/
error FailedDeployment();
/**
* @dev A necessary precompile is missing.
*/
error MissingPrecompile(address);
}

// From: contracts/lib/Manager.sol
// OpenZeppelin
// Local Imports
/**
* @title A Launchpad Manager
* @notice A contract for managing a launchpad, including configuration and state
* @dev This contract also manages Multi-Level-Marketing settings
*/
abstract contract Manager is Error, Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
// Basis for percentage calculations
uint256 public constant BASIS = 10_000; // Basis points for percentage calculations
// AUDIT: These constants might change before deployment, for risk assessment consider
uint256 public constant MAX_NUM_PARTNERS = 100; // Maximum 100 partners
uint256 public constant MAX_NUM_DESIGNATED_ADDRESSES = 100; // Maximum 100 designated addresses in a path
uint256 internal constant MAX_MLM_TREE_DEPTH = 500; // Maximum 500 iterations in the MLM tree depth
uint256 public constant MAX_MLM_LEVELS = 7; // Maximum 7 levels for multi-level-marketing
uint256 public constant MAX_LAUNCHPAD_TIME = 730 * 24 * 60 * 60; // Maximum launchpad time (2 Years)
uint256 public constant MAX_TOKEN_EXCHANGE_RATE = 100_000_000 * BASIS; // Maximum tokens per dollar
// Share-Settings, config parameters
uint256 public MAX_TOTAL_SHARE_PARTNERS; // Maximum payout for partner
uint256 public MAX_TOTAL_SHARE_MLM_LEVELS; // Maximum payout for partner
uint256 public MAX_TOTAL_SHARE_DESIGNATED_ADDRESS; // Maximum payout for a designated address
// variables
IERC20Metadata internal _launchpadToken; // Token to be launched
// Manage the token exchange rate
uint256 internal _tokenExchangeRate; // Token exchange rate
// Mange timestamps
uint256 internal _start; // Launchpad start time (UTC)
uint256 internal _end; // Launchpad end time (UTC)
// Manage partner configuration
Types.PartnerConfig[] internal _partners; // Partners involved in the launchpad
mapping(address => bool) internal _knownPartners; // Known partners
// Manage initial contract settings (known stable coins and price feeds for payment tokens)
mapping(address => bool) internal _stableCoins; // Supported stablecoins
mapping(address => address) internal _priceFeeds; // Supported price feeds
// Manage accepted payment tokens
address[] internal _paymentTokensLut; // Accepted payment tokens lookup table
mapping(address => bool) internal _acceptedPaymentToken; // Accepted payment token
// Manage designated addresses for MLM
Types.DesignatedAddressConfig[] internal _designatedAddresses; // Designated addresses involved in the launchpad
mapping(address => bool) internal _knownDesignatedAddresses; // Known designated addresses
mapping(address => uint256) internal _designatedAddressesShare; // The designated addresses share
// Manage levels (reward shares) for MLM
uint256[] internal _mlmLevels;
bool internal _mlmEnabled;
Types.CommissionMode internal _mlmCommissionMode;
// -----------------------------------------
// Events
// -----------------------------------------
/**
* a partner was added or modified
* @param partner the partner
* @param share the share rate
* @param commissionMode the commission mode
*/
event PartnerChanged(
address indexed partner,
uint256 share,
Types.CommissionMode commissionMode
);
/**
* a designated address was added or modified
* @param da the address
* @param share the share rate
*/
event DesignatedAddressChanged(address indexed da, uint256 share);
/**
* a partner was removed
* @param partner the partner
*/
event PartnerRemoved(address indexed partner);
/**
* a designated address was removed
* @param da the address
*/
event DesignatedAddressRemoved(address indexed da);
/**
* start timestamp has changed
* @param start the new start time
*/
event StartChanged(uint256 indexed start);
/**
* end timestamp has changed
* @param end the new end time
*/
event EndChanged(uint256 indexed end);
/**
* the MLM commission mode has changed
* @param mode the new mode
*/
event MlmCommissionModeChanged(Types.CommissionMode mode);
/**
* the MLM levels have changed
* @param levels the new levels
* @param isActive true if active, else false
*/
event MlmLevelsChanged(uint256[] levels, bool isActive);
/**
* the token exchange rate has changed
* @param rate the new token exchange rate
*/
event TokenExchangeRateChanged(uint256 rate);
// -----------------------------------------
// Modifiers
// -----------------------------------------
/**
* ensures that the launchpad is active
*/
modifier onlyWhenActive() {
if (!isActive()) {
revert LaunchpadNotActive();
}
_;
}
/**
* The owner is considered not to be a user
* - Partners and Dedicated addresses are allowed to mint (and hence can particiapte in MLM)
*/
modifier onlyUser() {
if (msg.sender == owner()) {
revert MintingNotAllowedForAddress();
}
_;
}
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
/**
* @notice Modify the launchpad commission mode, only the owner of the launchpad can modify
* @param commissionMode the new commission mode, must not be none
*/
function setMlmCommissionMode(
Types.CommissionMode commissionMode
) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (commissionMode == Types.CommissionMode.None) {
revert MlmNewCommissionModeMustNotBeNone();
}
_mlmCommissionMode = commissionMode;
emit MlmCommissionModeChanged(commissionMode);
}
/**
* @notice Sets the token exchange rate
* @param tokenExchangeRate The new token exchange rate
* Emits:
*  - `TokenExchangeRateChanged` on token exchange rate change
*/
function setTokenExchangeRate(
uint256 tokenExchangeRate
) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (tokenExchangeRate == 0) {
revert InvalidTokenExchangeRate();
}
if (tokenExchangeRate > MAX_TOKEN_EXCHANGE_RATE) {
revert InvalidTokenExchangeRate();
}
_tokenExchangeRate = tokenExchangeRate;
emit TokenExchangeRateChanged(_tokenExchangeRate);
}
/**
* @notice Sets the launchpad start time
* @param start The new start time
*/
function setStart(uint256 start) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (isActive()) {
revert LaunchpadIsActive();
}
if (start < block.timestamp) {
revert InvalidTimestamp();
}
if (start >= _end) {
revert InvalidTimestamp();
}
if (_end > start + MAX_LAUNCHPAD_TIME) {
revert InvalidTimestamp();
}
_start = start;
emit StartChanged(start);
}
/**
* @notice Sets the launchpad end time
* @param end The new end time
*/
function setEnd(uint256 end) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (end <= _start) {
revert InvalidTimestamp();
}
if (end > _start + MAX_LAUNCHPAD_TIME) {
revert InvalidTimestamp();
}
_end = end;
emit EndChanged(end);
}
/**
* @notice Removes a partner address from the contract.
* Only the contract owner can call this function.
* The function does not allow removals after the launchpad has ended and ensures that the given address is a known partner before removal.
* The removal mechanism is optimized for gas by swapping the partner to remove with the last one in the list, then popping the last entry.
*
* @param partner The partner address to be removed.
*
* Requirements:
* - Caller must be the contract owner.
* - Launchpad must not have ended.
* - `partner` must be a known partner.
*
* Emits:
* - `PartnerRemoved` event after successful removal.
*/
function removePartner(address partner) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (!_knownPartners[partner]) {
revert InvalidAddress();
}
// Initialize with an invalid value
uint256 indexToDelete = _partners.length;
// Locate the partner
for (uint256 i = 0; i < indexToDelete; i++) {
if (_partners[i].partner == partner) {
indexToDelete = i;
break;
}
}
// Swap with the last partner and remove
_partners[indexToDelete] = _partners[_partners.length - 1];
_partners.pop();
// Update the mapping
delete _knownPartners[partner];
emit PartnerRemoved(partner);
}
/**
* @notice Removes a designated address from the contract.
* Only the contract owner can call this function.
* The function does not allow removals after the launchpad has ended and ensures that the given address is known before removal.
* The removal approach is optimized for gas by swapping the address to remove with the last in the list, then performing a pop operation.
*
* @param da The designated address to be removed.
*
* Requirements:
* - Caller must be the contract owner.
* - Launchpad must not have ended.
* - `da` must be a known designated address.
*
* Emits:
* - `DesignatedAddressRemoved` event after successful removal.
*/
function removeDesignatedAddress(address da) external onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (!_knownDesignatedAddresses[da]) {
revert InvalidAddress();
}
// Initialize with an invalid value
uint256 indexToDelete = _designatedAddresses.length;
// Locate the partner
for (uint256 i = 0; i < indexToDelete; i++) {
if (_designatedAddresses[i].da == da) {
indexToDelete = i;
break;
}
}
// Swap with the last partner and remove
_designatedAddresses[indexToDelete] = _designatedAddresses[
_designatedAddresses.length - 1
];
_designatedAddresses.pop();
// Update the mapping
delete _knownDesignatedAddresses[da];
delete _designatedAddressesShare[da];
emit DesignatedAddressRemoved(da);
}
/**
* @notice Sets or updates a designated address along with its associated share rate.
* Only the contract owner can call this function.
* Designated address must meet several conditions:
* - Must not be the zero address.
* - Must have minted at least once.
* - Must not be a known partner.
* - Share assigned should be greater than zero and within allowable limits.
* If the designated address is not previously known, it will be added; otherwise, its share will be updated.
*
* @param da The designated address to modify or add.
* @param share The share rate for this designated address.
*
* Requirements:
* - Caller must be the contract owner.
* - `da` must not be the zero address.
* - `da` must have minted at least once.
* - `da` must not be a known partner.
* - `share` should be greater than 0.
* - `share` must not exceed the `MAX_TOTAL_SHARE_DESIGNATED_ADDRESS`.
* - Total number of designated addresses after adding must not exceed `MAX_NUM_DESIGNATED_ADDRESSES`.
*
* Emits:
* - `DesignatedAddressChanged` event after successful change.
*/
function manageDesignatedAddress(
address da,
uint256 share
) external onlyOwner {
if (da == address(0)) {
revert InvalidAddress();
}
if (!isMlmEnabled()) {
revert MlmDisabled();
}
if (!mlmUserExists(da)) {
revert MlmUserDoesNotExist();
}
if (_knownPartners[da]) {
revert MlmUserIsPartner();
}
if (share == 0) {
revert InvalidShareRate();
}
if (share > MAX_TOTAL_SHARE_DESIGNATED_ADDRESS) {
revert InvalidShareRate();
}
uint256 daCount = _designatedAddresses.length;
bool exists = _knownDesignatedAddresses[da];
if (exists) {
for (uint i = 0; i < daCount; i++) {
if (_designatedAddresses[i].da == da) {
_designatedAddresses[i].share = share;
break;
}
}
} else {
if (daCount + 1 >= MAX_NUM_DESIGNATED_ADDRESSES) {
revert OutOfBoundary();
}
// add new designated address
_designatedAddresses.push(
Types.DesignatedAddressConfig({da: da, share: share})
);
_knownDesignatedAddresses[da] = true;
}
// Update share mapping
_designatedAddressesShare[da] = share;
emit DesignatedAddressChanged(da, share);
}
/**
* @notice allow to see the token exchange rate (tokens per dollar)
*/
function getTokenExchangeRate() external view returns (uint256) {
return _tokenExchangeRate;
}
/**
* @notice get the MLM commission mode
*/
function getMlmCommissionMode()
external
view
returns (Types.CommissionMode)
{
return _mlmCommissionMode;
}
/**
* @notice Retrieves the list of all registered partner addresses.
* @return An array containing all the partner configurations.
*/
function getPartners()
external
view
returns (Types.PartnerConfig[] memory)
{
return _partners;
}
/**
* @notice Retrieves the list of all designated addresses.
* @return An array containing all the designated addresses configurations.
*/
function getDesignatedAddresses()
external
view
returns (Types.DesignatedAddressConfig[] memory)
{
return _designatedAddresses;
}
/**
* @notice Gets all payment token addreses enabled for this launchpad
*/
function getPaymentTokens() external view returns (address[] memory) {
return _paymentTokensLut;
}
/**
* @notice Gets the launchpad start time
*/
function getStart() external view returns (uint256) {
return _start;
}
/**
* @notice Gets the launchpad end time
*/
function getEnd() external view returns (uint256) {
return _end;
}
/**
* @notice Checks if the launchpad is pending
*/
function isPending() external view returns (bool) {
return block.timestamp < _start;
}
/**
* @notice Get MLM levels (frontends)
*/
function getMlmLevels() external view returns (uint256[] memory) {
return _mlmLevels;
}
// -----------------------------------------
// Public functions
// -----------------------------------------
/**
* @notice replaces the MLM levels. An empty array will disable MLM
* The first referrer corresponds to level 0, the referrals referrer to level 1...
* The array looks like: [level0, level1, level2...]
* @param mlmLevels the new mlm levels
*/
function setMlmLevels(uint256[] calldata mlmLevels) public onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (mlmLevels.length > MAX_MLM_LEVELS) {
revert OutOfBoundary();
}
uint256 totalRate = 0;
for (uint256 i = 0; i < mlmLevels.length; i++) {
totalRate += mlmLevels[i];
}
if (totalRate > MAX_TOTAL_SHARE_MLM_LEVELS) {
revert OutOfBoundary();
}
_mlmLevels = mlmLevels;
_mlmEnabled = _mlmLevels.length > 0;
emit MlmLevelsChanged(mlmLevels, _mlmEnabled);
}
/**
* @notice Allows the owner to add a new partner or update the share of an existing partner.
* @param partner The address of the partner.
* @param share The share assigned to the partner.
* @param commissionMode The commission mode assigned to a partner. If none, the commission mode will not be updated.
* @dev If the partner address already exists in the list, this function updates its share.
* Otherwise, it adds the address as a new partner. After modification, the function checks
* to ensure the total shares of all partners don't exceed `MAX_TOTAL_SHARE_PARTNERS`.
*
* Requirements:
* - Only the contract owner can call this function.
* - The launchpad must not have ended.
* - A partner cannot simultaneously be a designated address.
* - The assigned share must be greater than zero.
* - Partner address must not be the zero address.
* - The total number of partners after potential addition must be below the `MAX_NUM_PARTNERS`.
* - The cumulative shares of all partners must not exceed `MAX_TOTAL_SHARE_PARTNERS`.
*
* Emits:
* - `PartnerChanged` event after successful change.
*/
function managePartnerAddress(
address partner,
uint256 share,
Types.CommissionMode commissionMode
) public onlyOwner {
if (hasEnded()) {
revert LaunchpadHasEnded();
}
if (_knownDesignatedAddresses[partner]) {
revert MlmIsDesignatedAddress();
}
if (share == 0) {
revert InvalidShareRate();
}
if (partner == address(0)) {
revert InvalidAddress();
}
uint256 partnersCount = _partners.length;
bool exists = _knownPartners[partner];
// Update existing partner
if (exists) {
for (uint i = 0; i < partnersCount; i++) {
if (_partners[i].partner == partner) {
_partners[i].share = share;
if (commissionMode != Types.CommissionMode.None) {
_partners[i].commissionMode = commissionMode;
}
break;
}
}
} else {
if (partnersCount + 1 >= MAX_NUM_PARTNERS) {
revert OutOfBoundary();
}
// Add new partner
_partners.push(
Types.PartnerConfig({
partner: partner,
share: share,
commissionMode: commissionMode
})
);
_knownPartners[partner] = true;
partnersCount++;
}
uint totalPartnerShares = 0;
for (uint i = 0; i < partnersCount; i++) {
totalPartnerShares += _partners[i].share;
}
if (totalPartnerShares > MAX_TOTAL_SHARE_PARTNERS) {
revert TotalPartnerSharesExceeded();
}
emit PartnerChanged(partner, share, commissionMode);
}
/**
* @notice Checks if a token address is accepted for payment
*/
function isAcceptedPaymentToken(
address tokenAddress
) public view returns (bool) {
return _acceptedPaymentToken[tokenAddress];
}
/**
* @notice Gets the price feed for a token
*/
function getPriceFeed(address tokenAddress) public view returns (address) {
if (_priceFeeds[tokenAddress] == address(0)) {
revert InvalidAddress();
}
return _priceFeeds[tokenAddress];
}
/**
* @notice Checks if a token address is a known stablecoin
*/
function isKnownStableCoin(
address tokenAddress
) public view returns (bool) {
return _stableCoins[tokenAddress];
}
/**
* @notice Checks if the launchpad is active
*/
function isActive() public view returns (bool) {
return block.timestamp >= _start && block.timestamp <= _end;
}
/**
* @notice Checks if the launchpad has ended
*/
function hasEnded() public view returns (bool) {
return block.timestamp > _end;
}
/**
* @notice Get the launchpad token address
*/
function getLaunchpadTokenAddress() public view returns (address) {
return address(_launchpadToken);
}
/**
* @notice True if MLM is enabled, false otherwise
*/
function isMlmEnabled() public view returns (bool) {
return _mlmEnabled;
}
/**
* @notice Allows to check if an address is a MLM user
*/
function mlmUserExists(address user) public view virtual returns (bool);
// -----------------------------------------
// Internal functions
// -----------------------------------------
/**
* @notice Initializes the launchpad with the given configuration
* @param owner launchpad owner (must be launchpad token deployer)
* @param stableCoins An array of addresses of known stable coins.
* @param priceFeeds An array of known price feed configurations.
* @param config Configuration parameters for the launchpad
*/
function __Manager_init(
address owner,
address[] calldata stableCoins,
Types.PriceFeedConfig[] calldata priceFeeds,
Types.LaunchpadConfig calldata config
) internal onlyInitializing {
__Ownable_init(msg.sender);
__ReentrancyGuard_init();
// Initialise share settings
MAX_TOTAL_SHARE_PARTNERS = config.maxTotalSharePartners;
MAX_TOTAL_SHARE_MLM_LEVELS = config.maxTotalShareMlmLevels;
MAX_TOTAL_SHARE_DESIGNATED_ADDRESS = config
.maxTotalShareDesignatedAddress;
if (
(MAX_TOTAL_SHARE_PARTNERS +
MAX_TOTAL_SHARE_MLM_LEVELS +
MAX_TOTAL_SHARE_DESIGNATED_ADDRESS) > BASIS
) {
revert OutOfBoundary();
}
// Initialise timestamps
if (config.start < block.timestamp) {
revert InvalidTimestamp();
}
if (config.end <= config.start) {
revert InvalidTimestamp();
}
if (config.end > (config.start + MAX_LAUNCHPAD_TIME)) {
revert InvalidTimestamp();
}
_end = config.end;
_start = config.start;
// Initialise MLM Levels
setMlmLevels(config.mlmLevels);
// Initialise MLM Share Distribution Mode
if (config.mlmCommissionMode == Types.CommissionMode.None) {
revert InitialCommissionModeMustNotBeNone();
}
_mlmCommissionMode = config.mlmCommissionMode;
// Initialise known stablecoins (validated by the factory)
for (uint256 i = 0; i < stableCoins.length; i++) {
_stableCoins[stableCoins[i]] = true;
}
// Initialise known price feeds (validated by the factory)
for (uint256 i = 0; i < priceFeeds.length; i++) {
// explicitely allow price feed for zero address (ETH, BNB...)
_priceFeeds[priceFeeds[i].token] = priceFeeds[i].feed;
}
// Initialise token exchange rate
if (config.tokenExchangeRate == 0) {
revert InvalidTokenExchangeRate();
}
if (config.tokenExchangeRate > MAX_TOKEN_EXCHANGE_RATE) {
revert InvalidTokenExchangeRate();
}
_tokenExchangeRate = config.tokenExchangeRate;
// Initiliase accepted payment tokens
for (uint256 i = 0; i < config.paymentTokens.length; i++) {
if (_acceptedPaymentToken[config.paymentTokens[i]]) {
revert HasDuplicatedValues();
}
// Either it is a known stablecoin
if (_stableCoins[config.paymentTokens[i]]) {
_acceptedPaymentToken[config.paymentTokens[i]] = true;
continue;
}
// Or we have an oracle
if (_priceFeeds[config.paymentTokens[i]] != address(0)) {
_acceptedPaymentToken[config.paymentTokens[i]] = true;
continue;
}
// Else, revert
revert UnknownPaymentToken();
}
_paymentTokensLut = config.paymentTokens;
// Initiliase partners and check boundaries
for (uint256 i = 0; i < config.partners.length; i++) {
if (_knownPartners[config.partners[i].partner]) {
revert HasDuplicatedValues();
}
if (
config.partners[i].commissionMode == Types.CommissionMode.None
) {
revert InitialCommissionModeMustNotBeNone();
}
managePartnerAddress(
config.partners[i].partner,
config.partners[i].share,
config.partners[i].commissionMode
);
}
// Finally initiliase the launchpad token
if (config.launchpadToken == address(0)) {
revert InvalidAddress();
}
if (!_isLaunchpadToken(owner, config.launchpadToken)) {
revert TokenNotAcceptedForLaunchpad();
}
_launchpadToken = IERC20Metadata(config.launchpadToken);
if (_launchpadToken.totalSupply() == 0) {
revert TokenNotAcceptedForLaunchpad();
}
// Transfer ownership to the provided owner address
transferOwnership(owner);
}
// -----------------------------------------
// Private functions
// -----------------------------------------
/**
* @dev Checks if the given address is a valid Launchpad Token.
*
* This function checks if the provided token address meets the following criteria:
* 1. The owner of the launchpad must be the deployer of the token contract.
* 2. The token contract must have a function `isLaunchpadToken` that returns true.
* 3. Or: the token is ownable and the token owner is the launchpad owner
*
* If either of these conditions are not met, or if any exceptions are encountered,
* the function returns false.
*
* @param owner The launchpad owner.
* @param tokenAddress The address of the token to check.
* @return bool true if the address corresponds to a valid Launchpad Token; otherwise false.
* @notice The token contract at `tokenAddress` must have a `deployer` function that
*         returns the deployer's address, and an `isLaunchpadToken` function that
*         returns a boolean indicating if it's a Launchpad Token.
*         Or: token is ownable and launchpad owner is token owner
*/
function _isLaunchpadToken(
address owner,
address tokenAddress
) private view returns (bool) {
try OwnableUpgradeable(tokenAddress).owner() returns (address tokenOwner) {
// allow token owner
if (owner == tokenOwner) {
return true;
} else {
// do nothing, could still implement launchpad token interface
}
} catch (bytes memory) {
// do nothing
}
try ILaunchpadToken(tokenAddress).deployer() returns (
address deployerAddress
) {
if (owner != deployerAddress) {
return false;
}
} catch {
return false;
}
try ILaunchpadToken(tokenAddress).isLaunchpadToken() returns (
bool isLaunchpadToken
) {
return isLaunchpadToken;
} catch {
return false;
}
}
uint256[34] __gap;
}

// From: contracts/lib/MLM.sol
/**
* @title Multi-Level-Marketing Contract
* @dev A contract to calculate MLM distribution
*/
abstract contract MLM is Escrow {
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
/// @custom:storage-location erc7201:genielaunchpad.storage.MLMStorage
struct MLMStorage {
mapping(address => Types.MlmUser) _users;
mapping(address => bool) _userExists;
mapping(string => address) _idToAddress;
}
// keccak256(abi.encode(uint256(keccak256("genielaunchpad.storage.MLMStorage")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant MLMStorageLocation =
0xe04b7af5653a94335ff8e5bbdf4f3e710dd03b6b2a7c13f4d46aa29423019c00;
// -----------------------------------------
// Events
// -----------------------------------------
/**
* Emitted when a new user is onboarded
* @param referrer the referrer
* @param user the user
*/
event UserOnboarded(address indexed referrer, address indexed user);
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
/**
* @notice Gets the referrer ID for the caller (must mint once)
* @return Referral ID string
*/
function getUserReferralID(
address userAddress
) external view returns (string memory) {
MLMStorage storage $ = _getMLMStorage();
if (!$._userExists[userAddress]) {
revert MlmUserDoesNotExist();
}
return $._users[userAddress].userReferralID;
}
// -----------------------------------------
// Public functions
// -----------------------------------------
/**
* @notice Checks if a user exists in the MLM structure
* @param userAddress Address of the user to check
* @return bool indicating if the user exists
*/
function mlmUserExists(
address userAddress
) public view override returns (bool) {
return _getMLMStorage()._userExists[userAddress];
}
/**
* @notice Checks if a referral id is valid - belongs to one of the users
* @param referralId Referral ID string
* @return bool indicating if the user with provided referralId exists
*/
function referrerExist(
string memory referralId
) external view returns (bool) {
return _getMLMStorage()._idToAddress[referralId] != address(0);
}
// -----------------------------------------
// Internal functions
// -----------------------------------------
/**
* @dev Internal function to initialize MLM structure with the owner
*
* Emits:
* - `UserOnboarded` to indicate root of MLM tree
*/
function __MLM_init() internal onlyInitializing {
MLMStorage storage $ = _getMLMStorage();
address userAddress = owner();
string memory userReferralID = _generateReferralID(userAddress);
$._idToAddress[userReferralID] = userAddress;
$._userExists[userAddress] = true;
$._users[userAddress] = Types.MlmUser({
referrer: address(0),
userReferralID: userReferralID
});
// Emit with refferer == address(0) to mark root of MLM-tree
emit UserOnboarded(address(0), userAddress);
}
/**
* @dev Calculates commissions for referrals
* @param referrerID Referral ID
* @param paymentTokenAddress Address of the token used for payment
* @param amountPaymentToken Amount of tokens used for payment
* @param amountLaunchpadToken Amount minted by this transaction
* @return Array of MLM rewards
*
* Emits:
* - `UserOnboarded` if user is new
* - `CommissionPaid` when a commission is paid to a user
*/
function _getCommissions(
string memory referrerID,
address paymentTokenAddress,
uint256 amountPaymentToken,
uint256 amountLaunchpadToken
) internal returns (Types.Commission[] memory) {
MLMStorage storage $ = _getMLMStorage();
address referrerAddress = $._idToAddress[referrerID];
// The refferal must exist
if (referrerAddress == address(0)) {
revert InvalidAddress();
}
// Users cannot reffer themselves
if (referrerAddress == msg.sender) {
revert InvalidAddress();
}
_onboardUser($, msg.sender, referrerAddress);
// Iterate the tree till we hit the root or a designated address
uint8 level = 0;
// Only the first designated address gets a reward
bool foundDesignatedAddress = false;
// commissions, will be remapped later
// one commission per level + 1 designated address,
// if mlm commission mode is both, account for two commissions
// payment token and launchpad token
Types.Commission[] memory rewards = new Types.Commission[](
(_mlmLevels.length + 1) *
(_mlmCommissionMode == Types.CommissionMode.Both ? 2 : 1)
);
uint256 rewardCounter = 0;
// tree-depth
uint256 treeDepth = 1;
// Iterate from the user level upwards
Types.MlmUser memory iterator = $._users[msg.sender];
while (iterator.referrer != owner()) {
uint8 comissionPaidEventLevel = level;
// Abort iterating if we hit the maximum tree size
if (treeDepth >= MAX_MLM_TREE_DEPTH) {
revert MlmMaxTreeDepth();
}
uint256 share = 0;
// Payout shares within MLM levels first
if (level < _mlmLevels.length) {
// Get the share rate for this level
share = _mlmLevels[level];
// increase level index
++level;
}
// Search for dedicated address
if (
_knownDesignatedAddresses[iterator.referrer] &&
!foundDesignatedAddress
) {
share += _designatedAddressesShare[iterator.referrer];
comissionPaidEventLevel = Types.DA_COMMISSION_LEVEL;
// Found a designated address, only the first gets rewarded
foundDesignatedAddress = true;
}
// Share found, process
if (share > 0) {
if (
_mlmCommissionMode == Types.CommissionMode.PaymentToken ||
_mlmCommissionMode == Types.CommissionMode.Both
) {
uint256 paymentTokenAmount = (amountPaymentToken * share) /
BASIS;
rewards[rewardCounter] = Types.Commission({
beneficiary: iterator.referrer,
amount: paymentTokenAmount,
tokenAddress: paymentTokenAddress
});
emit Types.CommissionPaid(
iterator.referrer,
paymentTokenAddress,
msg.sender,
comissionPaidEventLevel,
paymentTokenAmount
);
++rewardCounter;
}
if (
_mlmCommissionMode == Types.CommissionMode.LaunchpadToken ||
_mlmCommissionMode == Types.CommissionMode.Both
) {
uint256 launchpadTokenAmount = (amountLaunchpadToken *
share) / BASIS;
rewards[rewardCounter] = Types.Commission({
beneficiary: iterator.referrer,
amount: launchpadTokenAmount,
tokenAddress: address(_launchpadToken)
});
emit Types.CommissionPaid(
iterator.referrer,
address(_launchpadToken),
msg.sender,
level,
launchpadTokenAmount
);
++rewardCounter;
}
}
// stop iterating if we out of MLM levels and found designated address,
// all other designated addresses are skipped
if (level > _mlmLevels.length && foundDesignatedAddress) {
break;
}
// move upwards
iterator = $._users[iterator.referrer];
++treeDepth;
}
// Create a new, smaller array to hold the populated rewards
Types.Commission[] memory finalRewards = new Types.Commission[](
rewardCounter
);
for (uint256 i = 0; i < rewardCounter; ++i) {
finalRewards[i] = rewards[i];
}
return finalRewards;
}
function _onboardUser(
MLMStorage storage $,
address userAddress,
address referrerAddress
) internal {
if (!$._userExists[userAddress]) {
string memory userReferralID = _generateReferralID(userAddress);
$._users[userAddress] = Types.MlmUser({
referrer: referrerAddress,
userReferralID: userReferralID
});
$._idToAddress[userReferralID] = userAddress;
$._userExists[userAddress] = true;
emit UserOnboarded(referrerAddress, userAddress);
return;
}
// The referrer must stay the same for a user
if ($._users[userAddress].referrer != referrerAddress) {
revert MlmCannotChangeReferrer();
}
}
// -----------------------------------------
// Private functions
// -----------------------------------------
function _getMLMStorage() private pure returns (MLMStorage storage $) {
assembly {
$.slot := MLMStorageLocation
}
}
/**
* @dev Generates a referrer ID based on the provided user address
* @param userAddress Address of the user for which to generate the referrer ID
* @return string containing the generated referrer ID
*/
function _generateReferralID(
address userAddress
) private view returns (string memory) {
bytes32 secretSalt = keccak256(
abi.encodePacked(
block.timestamp,
msg.sender,
owner(),
getLaunchpadTokenAddress(),
block.prevrandao
)
);
bytes32 hashed = keccak256(abi.encodePacked(userAddress, secretSalt));
return Utility.toHexString(hashed);
}
}

// From: contracts/lib/Escrow.sol
/**
* @title Escrow
* @dev A contract to hold and release ETH or ERC20 tokens for beneficiaries.
*/
abstract contract Escrow is Manager {
using SafeERC20 for IERC20;
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
/// @custom:storage-location erc7201:genielaunchpad.storage.EscrowStorage
struct EscrowStorage {
// Storage for holding beneficiaries' token balances
mapping(address => mapping(address => uint256)) _holdings;
uint256 _openLaunchpadTokenCommissions;
}
// keccak256(abi.encode(uint256(keccak256("genielaunchpad.storage.EscrowStorage")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant EscrowStorageLocation =
0x44dc4560bd68ecb7d1ace31cc82b462694f73a8c86cd91079a4a43658cbf0500;
// -----------------------------------------
// Events
// -----------------------------------------
/**
* Tokens have been released to beneficiary
* @param beneficiary the beneficiary
* @param asset the asset released
* @param amount the amount released
*/
event Released(
address indexed beneficiary,
address indexed asset,
uint256 amount
);
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
// -----------------------------------------
// Public functions
// -----------------------------------------
/**
* @dev Get the amount of ETH or ERC20 tokens or that are currently releaseable (available to be withdrawn) for the caller.
* @param token_ The address of the ERC20 token to check, address(0) for ETH
* @return The releaseable amount of the given token for the caller.
*/
function releaseable(
address token_,
address beneficiary
) public view returns (uint256) {
return _getEscrowStorage()._holdings[beneficiary][token_];
}
function openLaunchpadTokenCommissions() public view returns (uint256) {
return _getEscrowStorage()._openLaunchpadTokenCommissions;
}
// -----------------------------------------
// Internal functions
// -----------------------------------------
function __Escrow_init() internal onlyInitializing {}
/**
* @dev Deposit ETH or ERC20 tokens into the escrow for a specific beneficiary.
* @param beneficiary The address of the beneficiary to deposit tokens for.
* @param token_ The address of the ERC20 token to deposit, address(0) for ETH
* @param amount The amount of tokens to deposit.
*/
function _account(
address beneficiary,
address token_,
uint256 amount
) internal {
EscrowStorage storage $ = _getEscrowStorage();
/* This code is unreachable as handeled by the child contract, leaving a comment for @devs
if (beneficiary == address(0)) {
revert InvalidAddress();
}
*/
$._holdings[beneficiary][token_] += amount;
// Track total open launchpad token commissions
if (token_ == getLaunchpadTokenAddress()) {
$._openLaunchpadTokenCommissions += amount;
}
}
/**
* @dev Release deposited ETH or ERC20 tokens for the caller.
* @param token_ The address of the ERC20 token to release, address(0) for ETH
*/
function _release(address token_) internal nonReentrant returns (uint256) {
EscrowStorage storage $ = _getEscrowStorage();
uint256 amount = releaseable(token_, msg.sender);
if (amount == 0) {
revert NothingToRelease();
}
// Optimistic accounting
$._holdings[msg.sender][token_] = 0;
// Track total open launchpad token commissions
if (token_ == getLaunchpadTokenAddress()) {
$._openLaunchpadTokenCommissions -= amount;
}
// Release ETH
if (token_ == address(0)) {
/* This code is unreachable as there is no other way to withdraw ETH form the contract
leaving a comment for @devs
if (address(this).balance < amount) {
revert FatalEscrowError();
}
*/
// Perform the ETH transfer to the caller
Address.sendValue(payable(msg.sender), amount);
}
// Release ERC20
else {
IERC20 token = IERC20(token_);
/* This might only ever happen if the payment or the launchpad token is a scam and burns or modifies
the launchpad contract balanace externally, for @devs */
if (token.balanceOf(address(this)) < amount) {
revert FatalEscrowError();
}
// Perform the token transfer to the caller
token.safeTransfer(msg.sender, amount);
}
// Emit Released event
emit Released(msg.sender, token_, amount);
return amount;
}
// -----------------------------------------
// Private functions
// -----------------------------------------
function _getEscrowStorage() private pure returns (EscrowStorage storage $) {
assembly {
$.slot := EscrowStorageLocation
}
}
}

// From: contracts/lib/Launchpad.sol
// OpenZeppelin
// Chainlink
// Local imports
/**
* @title Launchpad
* @dev A contract to facilitate token launches and sales on a launchpad. Users can mint launchpad tokens in exchange for payment tokens.
* @dev MLM derives from Manager, exposing manager features to the launchpad
*/
contract Launchpad is Initializable, MLM {
using SafeERC20 for IERC20Metadata;
uint256 public constant PRICE_FEED_TIMEOUT = 1 hours;
// -----------------------------------------
// Type declarations
// -----------------------------------------
// -----------------------------------------
// State variables
// -----------------------------------------
// -----------------------------------------
// Events
// -----------------------------------------
/**
* Tokens have been minted
* @param user user address
* @param amount the amount minted
* @param tokenExchangeRate the token exchange rate for this mint
*/
event TokensMinted(
address indexed user,
uint256 amount,
uint256 tokenExchangeRate
);
// -----------------------------------------
// Modifiers
// -----------------------------------------
// -----------------------------------------
// Constructor
// -----------------------------------------
/// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
// Prevents initialization of implementation contract
_disableInitializers();
}
// -----------------------------------------
// Receive function
// -----------------------------------------
// -----------------------------------------
// Fallback function
// -----------------------------------------
// -----------------------------------------
// External functions
// -----------------------------------------
/**
* @notice Initializes the contract with owner and configuration parameters
* @param owner The address of the contract owner
* @param stableCoins An array of addresses of known stable coins.
* @param priceFeeds An array of known price feed configurations.
* @param config Configuration parameters for the launchpad
*/
function initialize(
address owner,
address[] calldata stableCoins,
Types.PriceFeedConfig[] calldata priceFeeds,
Types.LaunchpadConfig calldata config
) external initializer {
// Initialize the manager first
__Manager_init(owner, stableCoins, priceFeeds, config);
__Escrow_init();
__MLM_init();
}
/**
* @notice Mints new Launchpad tokens using the specified payment token and a referrer ID.
* @param paymentTokenAddress The ERC20 token address used for payment. If address(0), it's treated as ETH.
* @param amountPaymentToken The amount of payment tokens/ETH to be used for minting.
* @param referrerID The referrer ID string used for MLM purposes.
* @return amountLaunchpadToken The amount of Launchpad tokens minted and transferred to the sender.
*/
function mint(
address paymentTokenAddress,
uint256 amountPaymentToken,
string calldata referrerID
) external payable returns (uint256 amountLaunchpadToken) {
return _mint(paymentTokenAddress, amountPaymentToken, referrerID);
}
/**
* @notice Mints new Launchpad tokens using the specified payment token without a referrer ID.
* @param paymentTokenAddress The ERC20 token address used for payment. If address(0), it's treated as ETH.
* @param amountPaymentToken The amount of payment tokens/ETH to be used for minting.
* @return amountLaunchpadToken The amount of Launchpad tokens minted and transferred to the sender.
*/
function mint(
address paymentTokenAddress,
uint256 amountPaymentToken
) external payable returns (uint256 amountLaunchpadToken) {
string memory referrerID = "";
return _mint(paymentTokenAddress, amountPaymentToken, referrerID);
}
/**
* @notice Tops up launchpad tokens for future sales
* @param topUpAmount Amount of launchpad tokens to be topped up
*/
function topUpLaunchpadTokens(uint256 topUpAmount) external onlyOwner {
if (
_launchpadToken.allowance(msg.sender, address(this)) < topUpAmount
) {
revert LaunchpadTokenAllowanceTooLow();
}
// Transfer payment token from the sender to the contract
_launchpadToken.safeTransferFrom(
msg.sender,
address(this),
topUpAmount
);
}
/**
* @notice Recovers unsold launchpad tokens and sends them to the owner.
* @dev The amount recovered is limited to prevent removing tokens reserved for open commissions.
* Ensure that only the owner can call this function and no reentrancy is allowed.
*/
function recoverLaunchpadToken() external onlyOwner {
uint256 amount = _launchpadToken.balanceOf(address(this));
// Limit amount of tokens to recover to account for open commissions
amount -= openLaunchpadTokenCommissions();
if (amount == 0) {
return;
}
_launchpadToken.safeTransfer(address(owner()), amount);
}
/**
* @dev Release deposited ETH or ERC20 tokens for the caller.
* @param token The address of the ERC20 token to release, address(0) for ETH
*/
function release(address token) external returns (uint256) {
return _release(token);
}
// -----------------------------------------
// Public functions
// -----------------------------------------
/**
* @notice Retrieves the latest price for a given payment token
* @param paymentTokenAddress Address of the payment token
* @return decimals Number of decimals of the price feed
* @return price Latest price of the payment token
*/
function getPrice(
address paymentTokenAddress
) public view returns (uint8 decimals, uint256 price) {
address priceFeedAddress = getPriceFeed(paymentTokenAddress);
AggregatorV3Interface feed = AggregatorV3Interface(priceFeedAddress);
// prettier-ignore
(
/*uint80 roundID*/,
int answer,
/*uint256 startedAt*/,
uint256 timeStamp,
/*uint80 answeredInRound*/
) = feed.latestRoundData();
if (timeStamp < (block.timestamp - PRICE_FEED_TIMEOUT)) {
revert PriceFeedTimedOut();
}
if (answer <= 0) {
revert PriceFeedInvalidResponse();
}
decimals = feed.decimals();
return (decimals, uint256(answer));
}
/**
* @notice Converts a payment token amount to a launchpad token amount
* @param paymentTokenAddress Address of the payment token
* @param amountPaymentToken Amount of payment tokens
* @return payout Amount of launchpad tokens
*/
function quote(
address paymentTokenAddress,
uint256 amountPaymentToken
) public view returns (uint256 payout) {
IERC20Metadata paymentToken = IERC20Metadata(paymentTokenAddress);
// Test remaining input parameters
if (amountPaymentToken <= 0) {
revert InvalidPaymentTokenAmount();
}
// Determine a USD price to peg payout to USD values
uint256 usdValuePaymentToken = 0;
uint8 paymentTokenDecimals = 0;
if (paymentTokenAddress == address(0)) {
paymentTokenDecimals = 18;
} else {
paymentTokenDecimals = paymentToken.decimals();
}
if (isKnownStableCoin(paymentTokenAddress)) {
if (!isAcceptedPaymentToken(paymentTokenAddress)) {
revert UnknownPaymentToken();
}
// Handle payment with stable tokens (USDC, USDT, DAI...), 1:1
usdValuePaymentToken =
amountPaymentToken *
10 ** (18 - paymentTokenDecimals);
} else {
if (!isAcceptedPaymentToken(paymentTokenAddress)) {
revert UnknownPaymentToken();
}
// Request price
(uint8 decimals, uint256 price) = getPrice(paymentTokenAddress);
// Convert to USD value considering both the price feed and payment token decimals
usdValuePaymentToken =
(uint256(price) *
amountPaymentToken *
10 ** (18 - paymentTokenDecimals)) /
(10 ** decimals);
}
// How many tokens to pay out per dollar?
uint256 launchpadTokenDecimals = _launchpadToken.decimals();
uint256 base = 10 ** (18 - launchpadTokenDecimals);
payout = (usdValuePaymentToken * _tokenExchangeRate) / BASIS / base;
return payout;
}
// -----------------------------------------
// Internal functions
// -----------------------------------------
// -----------------------------------------
// Private functions
// -----------------------------------------
/**
* @dev Internal function to handle the logic of minting Launchpad tokens.
* @param paymentTokenAddress The ERC20 token address used for payment. If address(0), it's treated as ETH.
* @param amountPaymentToken The amount of payment tokens/ETH to be used for minting.
* @param referrerID The referrer ID string used for MLM purposes.
* @return amountLaunchpadToken The amount of Launchpad tokens minted and transferred to the sender.
*/
function _mint(
address paymentTokenAddress,
uint256 amountPaymentToken,
string memory referrerID
)
private
nonReentrant
onlyWhenActive
onlyUser
returns (uint256 amountLaunchpadToken)
{
// short-circuit evaluation
if (_mlmEnabled && Utility.getStringLength(referrerID) == 0) {
revert InvalidRefferId();
}
IERC20Metadata paymentToken = IERC20Metadata(paymentTokenAddress);
if (paymentTokenAddress != address(0)) {
// Ensure contract has allowance to transfer specified amount of token
if (
paymentToken.allowance(msg.sender, address(this)) <
amountPaymentToken
) {
revert PaymentTokenAllowanceTooLow();
}
// Ensure user has enough tokens to transfer
if (paymentToken.balanceOf(msg.sender) < amountPaymentToken) {
revert PaymentTokenBalanceTooLow();
}
// Transfer payment token from the sender to the contract
paymentToken.safeTransferFrom(
msg.sender,
address(this),
amountPaymentToken
);
} else {
// Check that the value of ETH sent matches the intended amount
if (msg.value != amountPaymentToken) {
revert IntendedEthAmountMissmatch();
}
}
// Get a quote for the launchpad token payout
amountLaunchpadToken = quote(paymentTokenAddress, amountPaymentToken);
// Distribute commission to partners
uint256 totalPaymentTokenCommission = 0;
for (uint256 i = 0; i < _partners.length; i++) {
Types.PartnerConfig memory partnerConfig = _partners[i];
// Do not pay commissions if partner is the minter
if (partnerConfig.partner == msg.sender) {
continue;
}
// Calculate the share for each partner
uint256 paymentTokenCommission = (amountPaymentToken *
partnerConfig.share) / BASIS;
// The launchpad token payout is already pegged to the dollar value
uint256 launchpadTokenCommission = (amountLaunchpadToken *
partnerConfig.share) / BASIS;
if (
partnerConfig.commissionMode ==
Types.CommissionMode.PaymentToken ||
partnerConfig.commissionMode == Types.CommissionMode.Both
) {
// Account for payment token commission
_account(
partnerConfig.partner,
paymentTokenAddress,
paymentTokenCommission
);
// Accumulate the total payment token commission
totalPaymentTokenCommission += paymentTokenCommission;
// Emit event to track partner commissions
emit Types.CommissionPaid(
partnerConfig.partner,
paymentTokenAddress,
msg.sender,
Types.PARTNER_COMMISSION_LEVEL,
paymentTokenCommission
);
}
if (
partnerConfig.commissionMode ==
Types.CommissionMode.LaunchpadToken ||
partnerConfig.commissionMode == Types.CommissionMode.Both
) {
// Account for payment token commission
_account(
partnerConfig.partner,
address(_launchpadToken),
launchpadTokenCommission
);
// Emit event to track partner commissions
emit Types.CommissionPaid(
partnerConfig.partner,
address(_launchpadToken),
msg.sender,
Types.PARTNER_COMMISSION_LEVEL,
launchpadTokenCommission
);
}
}
// Distribute payment tokens to referrals (MLM)
if (_mlmEnabled) {
Types.Commission[] memory commission = _getCommissions(
referrerID,
paymentTokenAddress,
amountPaymentToken,
amountLaunchpadToken
);
for (uint256 i = 0; i < commission.length; i++) {
_account(
commission[i].beneficiary,
commission[i].tokenAddress,
commission[i].amount
);
// Accumulate the total payment token commission
if (commission[i].tokenAddress == paymentTokenAddress) {
totalPaymentTokenCommission += commission[i].amount;
}
}
}
// Calculate the remaining amount after partner shares are deducted
uint256 remainingPaymentToken = amountPaymentToken -
totalPaymentTokenCommission;
// Account for the owner share
_account(owner(), paymentTokenAddress, remainingPaymentToken);
// Emit event to track owner commissions
emit Types.CommissionPaid(
owner(),
paymentTokenAddress,
msg.sender,
Types.OWNER_COMMISSION_LEVEL,
remainingPaymentToken
);
// Ensure contract has enough launchpad tokens after accounting for all commissions
if (
_launchpadToken.balanceOf(address(this)) <
(amountLaunchpadToken + openLaunchpadTokenCommissions())
) {
revert LaunchpadTokenBalanceTooLow();
}
// Transfer amount of tokens to the sender
_launchpadToken.safeTransfer(msg.sender, amountLaunchpadToken);
emit TokensMinted(msg.sender, amountLaunchpadToken, _tokenExchangeRate);
return amountLaunchpadToken;
}
}
