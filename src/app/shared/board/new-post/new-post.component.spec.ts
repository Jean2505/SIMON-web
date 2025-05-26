import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewPostComponent } from './new-post.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage } from '@angular/fire/storage';
import { AuthService } from '../../../core/services/auth.service';

describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserName']);
    const storageMock = jasmine.createSpyObj('Storage', ['ref']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, NewPostComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Storage, useValue: storageMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    authServiceSpy.getUserName.and.returnValue('UsuárioTeste');
    component.subjectId = '123';
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o nome do usuário', () => {
    component.ngOnInit();
    expect(component.userName).toBe('UsuárioTeste');
  });

  it('deve emitir close ao cancelar com confirmação', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.close, 'emit');
    component.confirmCancel();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('não deve emitir close se o cancelamento for negado', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.close, 'emit');
    component.confirmCancel();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('deve alternar anexos ao clicar em "Anexar"', () => {
    component.isAttaching = false;
    component.onSelectAttach();
    expect(component.isAttaching).toBeTrue();

    component.onSelectAttach();
    expect(component.isAttaching).toBeFalse();
  });

  it('deve adicionar e remover vídeos do YouTube', () => {
    const initialLength = component.videos.length;
    component.addYoutubeUrl();
    expect(component.videos.length).toBe(initialLength + 1);

    component.removeYoutubeUrl(0);
    expect(component.videos.length).toBe(initialLength);
  });

  it('deve adicionar arquivos ao selecionar', () => {
    const file = new File(['conteúdo'], 'teste.txt', { type: 'text/plain' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;
    component.onFileSelected(event);
    expect(component.files.length).toBe(1);
    expect(component.files[0].name).toBe('teste.txt');
  });

  it('deve adicionar imagens ao selecionar', () => {
    const image = new File(['img'], 'foto.png', { type: 'image/png' });
    const event = {
      target: {
        files: [image]
      }
    } as unknown as Event;
    component.onImageSelected(event);
    expect(component.images.length).toBe(1);
    expect(component.images[0].name).toBe('foto.png');
  });

  it('deve remover arquivos e imagens da lista', () => {
    component.files = [new File(['a'], 'a.txt')];
    component.removeFile(0);
    expect(component.files.length).toBe(0);

    component.images = [new File(['i'], 'i.png')];
    component.removeImage(0);
    expect(component.images.length).toBe(0);
  });

  it('deve enviar post sem anexos', fakeAsync(() => {
    component.enteredTitle = 'Título';
    component.enteredContent = 'Conteúdo';
    component.videos = ['https://youtube.com'];

    spyOn(component.close, 'emit');
    component.onPost();

    const req = httpMock.expectOne('http://localhost:3000/createMuralPost');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Título');

    req.flush({ success: true });
    tick();

    expect(component.close.emit).toHaveBeenCalled();
  }));
});
