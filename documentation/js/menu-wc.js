'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">bazaar documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuctionsModule.html" data-type="entity-link" >AuctionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' : 'data-bs-target="#xs-controllers-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' :
                                            'id="xs-controllers-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' }>
                                            <li class="link">
                                                <a href="controllers/AuctionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuctionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' : 'data-bs-target="#xs-injectables-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' :
                                        'id="xs-injectables-links-module-AuctionsModule-f3de04cf0e1a047aa95b95ecc63fbb05108dcf0119282adfce15e9e5e3ef733b733e6f25da4db02644d2e9b4eb1369402508d77f88ce0124b934ce65108ca142"' }>
                                        <li class="link">
                                            <a href="injectables/AuctionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuctionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BidsModule.html" data-type="entity-link" >BidsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' : 'data-bs-target="#xs-controllers-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' :
                                            'id="xs-controllers-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' }>
                                            <li class="link">
                                                <a href="controllers/BidsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BidsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' : 'data-bs-target="#xs-injectables-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' :
                                        'id="xs-injectables-links-module-BidsModule-b958f117f056ff6da95f28edf0ad0d5b0f5e4eca5f470401e0d688c4ca6465c98c9dd685d47388581f477c012f3f9a720af47cbb83a6a6702a07f60ac405461e"' }>
                                        <li class="link">
                                            <a href="injectables/BidsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BidsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' :
                                            'id="xs-controllers-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' :
                                        'id="xs-injectables-links-module-UsersModule-a3781082c26eed202f8f599241cc94e909781e00423faee24a6525aba5566ae299f475624e65b519a2bd6769939ec2a759955199e6b325aeefd393ac9f079ef7"' }>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WebsocketsModule.html" data-type="entity-link" >WebsocketsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WebsocketsModule-8ba63aa4e75c25ac563c5df9ab4f860299c244f881a9a8a81da601c8824060c6e84a0edfe28bed50e7c096c6bd2433585d6279ab4b24e1c4f0344b3a619e53e3"' : 'data-bs-target="#xs-injectables-links-module-WebsocketsModule-8ba63aa4e75c25ac563c5df9ab4f860299c244f881a9a8a81da601c8824060c6e84a0edfe28bed50e7c096c6bd2433585d6279ab4b24e1c4f0344b3a619e53e3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WebsocketsModule-8ba63aa4e75c25ac563c5df9ab4f860299c244f881a9a8a81da601c8824060c6e84a0edfe28bed50e7c096c6bd2433585d6279ab4b24e1c4f0344b3a619e53e3"' :
                                        'id="xs-injectables-links-module-WebsocketsModule-8ba63aa4e75c25ac563c5df9ab4f860299c244f881a9a8a81da601c8824060c6e84a0edfe28bed50e7c096c6bd2433585d6279ab4b24e1c4f0344b3a619e53e3"' }>
                                        <li class="link">
                                            <a href="injectables/BidsGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BidsGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CustomLoggerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomLoggerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuctionsController.html" data-type="entity-link" >AuctionsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BidsController.html" data-type="entity-link" >BidsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Auction.html" data-type="entity-link" >Auction</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Bid.html" data-type="entity-link" >Bid</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuctionFiltersDto.html" data-type="entity-link" >AuctionFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuctionDto.html" data-type="entity-link" >CreateAuctionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitialMigration1732649684452.html" data-type="entity-link" >InitialMigration1732649684452</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link" >LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Migrations1733386120063.html" data-type="entity-link" >Migrations1733386120063</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationOptionsDto.html" data-type="entity-link" >PaginationOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlaceBidDto.html" data-type="entity-link" >PlaceBidDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserDto.html" data-type="entity-link" >RegisterUserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuctionsService.html" data-type="entity-link" >AuctionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BidsGateway.html" data-type="entity-link" >BidsGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BidsService.html" data-type="entity-link" >BidsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomLoggerService.html" data-type="entity-link" >CustomLoggerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});