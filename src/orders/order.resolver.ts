import { Inject } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { boolean } from 'joi';
import { AuthUser } from 'src/auth/auth-user.decorater';
import { Role } from 'src/auth/role.decorator';
import { PUB_SUB } from 'src/common/common.contstants';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

// const pubsub = new PubSub();
//pubsub는 오직 한개여야만하나여야하기에 때문에 모든 모듈ㅇ ㅣ사용할 수있도록 옮겨야한다
@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}
  // common module에서 내보낸 pubsub을 사용하고 싶은 모든곳에 inject데코레이터로 주입해준다.

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  // 트리거의 이름과 publish이름 같아야한다.
  // publish의 payload는 객체로 Mutation 함수와 이름이 같아야한다.
  // 이 부분이 객체 형태로 페이로드가 된다.
  // 변수는 서브스크립션에 준 변수potatoId를 가진 객체
  @Mutation((returns) => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.pubsub.publish('hotPotato', {
      readyPotato: potatoId,
    });
    return true;
  }
  // Subscription은 몇가지 규칙을 갖고있고 뭘 return 하느냐에 따라 달라진다
  // Authuser 데코레이터가 호출 되면 그래프큐엘 내부에서 user를 찾는다.
  // graphQL은 strin을 리턴하지만 실제함수는 asyn cIterator를 리턴한다.
  // 그래프 큐엘에 Subscription 쓸 수 있게해준다.
  // pubsub인스턴스를 생성하는데 이걸 통해app내부에 메세지를 교환한다.
  @Subscription((returns) => String, {
    filter: ({ readyPotato }, { potatoId }) => {
      return readyPotato === potatoId;
    },
    resolve: ({ readyPotato }) => `your potato with this id ${readyPotato}`,
  })
  @Role(['Any'])
  readyPotato(@Args('potatoId') potatoId: number) {
    return this.pubsub.asyncIterator('hotPotato');
  }
  // 주문 업데이트를 listening 하길 원하며 누군가 주문을 업데이트하면 주문 업데이트를 publish한다.
  // 우리한테 필요한 업데이트만 보기위해서 필터링이 필요하다
  // 즉  나의 레스토랑에 들어온 주문만을 보여주기위해서 필요
}
